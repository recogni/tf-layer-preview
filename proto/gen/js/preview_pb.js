/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.preview.OpPreview', null, global);
goog.exportSymbol('proto.preview.Packet', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.preview.OpPreview = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.preview.OpPreview, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.preview.OpPreview.displayName = 'proto.preview.OpPreview';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.preview.OpPreview.prototype.toObject = function(opt_includeInstance) {
  return proto.preview.OpPreview.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.preview.OpPreview} msg The msg instance to transform.
 * @return {!Object}
 */
proto.preview.OpPreview.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    data: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.preview.OpPreview}
 */
proto.preview.OpPreview.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.preview.OpPreview;
  return proto.preview.OpPreview.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.preview.OpPreview} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.preview.OpPreview}
 */
proto.preview.OpPreview.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.preview.OpPreview.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.preview.OpPreview.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.preview.OpPreview} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.preview.OpPreview.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getData();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.preview.OpPreview.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.preview.OpPreview.prototype.setName = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string data = 2;
 * @return {string}
 */
proto.preview.OpPreview.prototype.getData = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.preview.OpPreview.prototype.setData = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.preview.Packet = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.preview.Packet.oneofGroups_);
};
goog.inherits(proto.preview.Packet, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.preview.Packet.displayName = 'proto.preview.Packet';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.preview.Packet.oneofGroups_ = [[1,2,3]];

/**
 * @enum {number}
 */
proto.preview.Packet.PacketCase = {
  PACKET_NOT_SET: 0,
  MESSAGE: 1,
  ERROR: 2,
  PREVIEW: 3
};

/**
 * @return {proto.preview.Packet.PacketCase}
 */
proto.preview.Packet.prototype.getPacketCase = function() {
  return /** @type {proto.preview.Packet.PacketCase} */(jspb.Message.computeOneofCase(this, proto.preview.Packet.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.preview.Packet.prototype.toObject = function(opt_includeInstance) {
  return proto.preview.Packet.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.preview.Packet} msg The msg instance to transform.
 * @return {!Object}
 */
proto.preview.Packet.toObject = function(includeInstance, msg) {
  var f, obj = {
    message: jspb.Message.getFieldWithDefault(msg, 1, ""),
    error: jspb.Message.getFieldWithDefault(msg, 2, ""),
    preview: (f = msg.getPreview()) && proto.preview.OpPreview.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.preview.Packet}
 */
proto.preview.Packet.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.preview.Packet;
  return proto.preview.Packet.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.preview.Packet} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.preview.Packet}
 */
proto.preview.Packet.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessage(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setError(value);
      break;
    case 3:
      var value = new proto.preview.OpPreview;
      reader.readMessage(value,proto.preview.OpPreview.deserializeBinaryFromReader);
      msg.setPreview(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.preview.Packet.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.preview.Packet.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.preview.Packet} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.preview.Packet.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getPreview();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.preview.OpPreview.serializeBinaryToWriter
    );
  }
};


/**
 * optional string message = 1;
 * @return {string}
 */
proto.preview.Packet.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.preview.Packet.prototype.setMessage = function(value) {
  jspb.Message.setOneofField(this, 1, proto.preview.Packet.oneofGroups_[0], value);
};


proto.preview.Packet.prototype.clearMessage = function() {
  jspb.Message.setOneofField(this, 1, proto.preview.Packet.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.preview.Packet.prototype.hasMessage = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string error = 2;
 * @return {string}
 */
proto.preview.Packet.prototype.getError = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.preview.Packet.prototype.setError = function(value) {
  jspb.Message.setOneofField(this, 2, proto.preview.Packet.oneofGroups_[0], value);
};


proto.preview.Packet.prototype.clearError = function() {
  jspb.Message.setOneofField(this, 2, proto.preview.Packet.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.preview.Packet.prototype.hasError = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional OpPreview preview = 3;
 * @return {?proto.preview.OpPreview}
 */
proto.preview.Packet.prototype.getPreview = function() {
  return /** @type{?proto.preview.OpPreview} */ (
    jspb.Message.getWrapperField(this, proto.preview.OpPreview, 3));
};


/** @param {?proto.preview.OpPreview|undefined} value */
proto.preview.Packet.prototype.setPreview = function(value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.preview.Packet.oneofGroups_[0], value);
};


proto.preview.Packet.prototype.clearPreview = function() {
  this.setPreview(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.preview.Packet.prototype.hasPreview = function() {
  return jspb.Message.getField(this, 3) != null;
};


goog.object.extend(exports, proto.preview);
