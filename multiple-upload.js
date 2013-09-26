// multiple false is what you want to change, under frame:function()

jQuery(document).ready(function() {
	var mediaMetaBox = {
		config: {
			dom: {}
			, _frame: undefined
		}

		, init: function() {
			this.config.dom.$parent = jQuery('.kwpn-image-parent');
			this.config.dom.$uploadButton = jQuery('.kwpn-image-upload-button');
			this.config.dom.$uploadInput = jQuery('.kwpn-image-upload-id');
			this.config.dom.$uploadPreview = jQuery('.kwpn-image-upload-preview');
			this.config.dom.$uploadRemoveButton = jQuery('.kwpn-image-remove-button');

			this.binds();
		}

		, binds: function() {
			var self = this;

			jQuery('#wpbody').on('click', '.kwpn-image-upload-button', function(e) {
				e.preventDefault();

				self.frame().open();
			});
			
			jQuery('#wpbody').on('click', '.kwpn-image-remove-button', function(e) {
				e.preventDefault();
				
				self.config.dom.$uploadInput.val(null);
				self.config.dom.$uploadPreview.empty();
				self.ajaxIt();
			});
		}

		, frame: function() {
			if (this._frame)
				return this._frame;

			var self = this;

			this._frame = wp.media({
				title: self.config.dom.$uploadButton.data('title')
				, library: {
					type: 'image'
				}
				, button: {
					text: self.config.dom.$uploadButton.data('update-text')
				}
				, multiple: false
			});

			this._frame.state('library').on('select', this.select);
			return this._frame;
		}
		
		, select: function() {
			var selection = this.get('selection').single();
			
			mediaMetaBox.config.dom.$uploadInput.val( selection ? selection.id : -1 );
			
			mediaMetaBox.ajaxIt(selection.id);
		}
		
		, ajaxIt: function(id) {
			if( undefined === id)
				id = null;
			
			var settings = wp.media.view.settings;
			
			wp.media.post( 'kwpn_set_header', {
				json:true,
				post_id: settings.post.id,
				custom_header:id
			}).done(function(html) {
				mediaMetaBox.config.dom.$uploadPreview.html(html);
			});
		}
	};

	mediaMetaBox.init();
});
