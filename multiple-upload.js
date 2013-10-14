pronamicMedia = function(elem, options) {
this.elem = elem;
this.$elem = jQuery(elem);
this.options = options;
};
 
pronamicMedia.prototype = {
_frame:undefined
 
, defaults: {}
 
, setDefaults: function() {
this.defaults.$target = jQuery(this.$elem.data('target'));
this.defaults.mediaOptions = {
title:this.$elem.data('title')
, library: { type: 'image' }
, button: { text: this.$elem.data('update-text')}
, multiple: false
};
}
 
, init: function() {
this.setDefaults();
this.config = jQuery.extend({}, this.defaults, this.options);
this.binds();
return this;
}
 
, binds: function() {
var self = this;
 
this.$elem.on('click', function(e) {
e.preventDefault();
self.frame().open();
} );
}
 
, frame: function() {
var self = this;
 
if(this._frame)
return this._frame;
 
this._frame = wp.media(this.config.mediaOptions);
this._frame.state('library').on('select', function() {
var selection = this.get('selection');
self.config.$target.val( selection.pluck('id') );
});
return this._frame;
}
};
 
jQuery.fn.pronamicMedia = function(options) {
return this.each( function() {
new pronamicMedia(this, options).init();
} );
};
