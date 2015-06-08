var OP_CODES = [
  new Buffer([0x10]), // All Hashes in OP_RETURN - Pay-to-PubkeyHash
  new Buffer([0x11]), // SHA2 in Pay-to-Script-Hash multi-sig output (1 out of 2)
  new Buffer([0x12]), // All Hashes in Pay-to-Script-Hash multi-sig outputs (1 out of 3)
  new Buffer([0x13]), // Low security transaction no SHA2 for torrent data. SHA1 is always inside OP_RETURN in this case.
  new Buffer([0x14]), // Low security transaction no SHA2 for torrent data. SHA1 is always inside OP_RETURN in this case. also no rules inside the metadata (if there are any they will be in ignored)
  new Buffer([0x15])  // No metadata or rules (no SHA1 or SHA2)
]

var paymentCodex = require('cc-payment-encoder')

var consumer = function (buff) {
  var curr = 0
  return function consume (len) {
    return buff.slice(curr, curr += len)
  }
}

var padLeadingZeros = function (hex, byteSize) {
  return (hex.length === byteSize * 2) ? hex : padLeadingZeros('0' + hex, byteSize)
}

module.exports = {
  encode: function (data, byteSize) {
    if (!data
      || typeof data.payments === 'undefined'
      ) {
      throw new Error('Missing Data')
    }
    var opcode
    var hash = new Buffer(0)
    var protocol = new Buffer(padLeadingZeros(data.protocol.toString(16), 2), 'hex')
    var version = new Buffer([data.version])
    var transferHeader = Buffer.concat([protocol, version])
    var payments = paymentCodex.encodeBulk(data.payments)
    var issueByteSize = transferHeader.length + payments.length + 1

    if (issueByteSize > byteSize) throw new Error('Data code is bigger then the allowed byte size')
    if (!data.sha2) {
      if (data.torrentHash) {
        opcode = data.noRules ? OP_CODES[5] : OP_CODES[4]
        if (issueByteSize + data.torrentHash.length > byteSize) throw new Error('Can\'t fit Torrent Hash in byte size')
        return {codeBuffer: Buffer.concat([transferHeader, opcode, data.torrentHash, payments]), leftover: []}
      }
      return {codeBuffer: Buffer.concat([transferHeader, OP_CODES[6], hash, payments]), leftover: []}
    }
    if (!data.torrentHash) throw new Error('Torrent Hash is missing')
    var leftover = [data.torrentHash, data.sha2]

    opcode = OP_CODES[3]
    issueByteSize = issueByteSize + data.torrentHash.length

    if (issueByteSize <= byteSize) {
      hash = Buffer.concat([hash, leftover.shift()])
      opcode = OP_CODES[2]
      issueByteSize = issueByteSize + data.sha2.length
    }
    if (issueByteSize <= byteSize) {
      hash = Buffer.concat([hash, leftover.shift()])
      opcode = OP_CODES[1]
    }

    return {codeBuffer: Buffer.concat([transferHeader, opcode, hash, payments]), leftover: leftover}
  },

  decode: function (op_code_buffer) {
    var data = {}
    var consume = consumer(op_code_buffer)
    data.protocol = parseInt(consume(2).toString('hex'), 16)
    data.version = parseInt(consume(1).toString('hex'), 16)
    var opcode = consume(1)
    if (opcode.equals(OP_CODES[1])) {
      data.torrentHash = consume(20)
      data.sha2 = consume(32)
    } else if (opcode.equals(OP_CODES[2])) {
      data.torrentHash = consume(20)
    } else if (opcode.equals(OP_CODES[3])) {
    } else if (opcode.equals(OP_CODES[4])) {
      data.torrentHash = consume(20)
      data.noRules = false
    } else if (opcode.equals(OP_CODES[5])) {
      data.torrentHash = consume(20)
      data.noRules = true
    } else if (opcode.equals(OP_CODES[6])) {
    } else {
      throw new Error('Unrecognized Code')
    }
    data.payments = paymentCodex.decodeBulk(consume)

    return data
  }
}
