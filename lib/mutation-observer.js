function MutationRecord () {
}

function MutationObserver (handler) {
  this.waitTime = 10;

  this.handler = handler;
  this.timeout = null;
  this.mutations = [];
}

MutationObserver.prototype.getRecordForTarget = function (node) {
  var i;

  for (i = 0; i < this.mutations.length; i++) {
    if (this.mutations[i].target === node) {
      return this.mutations[i];
    }
  }

  return false;
};

MutationObserver.prototype.addInsertEvent = function (node) {
  var record = this.getRecordForTarget(node);

  if (record) {
    record.addedNodes.push(node);
    return;
  }

  record = new MutationRecord();
  record.target = node.parentNode;
  record.addedNodes = [node];
  record.type = 'childList';

  this.mutations.push(record);

  this.queueCallback();
};

MutationObserver.prototype.queueCallback = function () {
  var self = this;

  clearTimeout(this.timeout);

  this.timeout = setTimeout(function () {
    self.handler(self.mutations);
    self.mutations = [];
  }, this.waitTime);
};

MutationObserver.prototype.observe = function (target, config) {
  // config is ignored
  target.ownerDocument.mutationObserver = this;
};

module.exports = MutationObserver;
