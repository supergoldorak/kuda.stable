/* 
 * Kuda includes a library and editor for authoring interactive 3D content for the web.
 * Copyright (C) 2011 SRI International.
 *
 * This program is free software; you can redistribute it and/or modify it under the terms
 * of the GNU General Public License as published by the Free Software Foundation; either 
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; 
 * if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, 
 * Boston, MA 02110-1301 USA.
 */

var editor = (function(module, jQuery) {
	module.ui = module.ui || {};	
	
	module.ui.ListType = {
		UNORDERED: 0,
		ORDERED: 1
	};
	
	module.EventTypes = module.EventTypes || {};
	module.EventTypes.ListItemRemoveClicked = "listener.ListItemRemoveClicked";
	module.EventTypes.ListItemEditClicked = "listener.ListItemEditClicked";
	module.EventTypes.ListItemClicked = "listener.ListItemClicked";
	
	/*
	 * Configuration object for the Widget.
	 */
	module.ui.ListDefaults = {
		id: '',
		cssClass: '',
		prefix: 'lst',
		type: module.ui.ListType.UNORDERED,
		sortable: false
	};

	module.ui.List = module.ui.Component.extend({
		init: function(options) {
			var newOpts = jQuery.extend({}, module.ui.ListDefaults, options);
			this._super(newOpts);
			
			this.list;
			this.listItemTemplate;
			this.idCounter = 0;
			this.listItems = new Hashtable();
		},
		
		add: function(liWidget) {
			this.list.append(this.createListItem(liWidget));
			liWidget.setParent(this);
		},
		
		after: function(liWidget, previousWidget) {
			previousWidget.getUI().parent().after(this.createListItem(liWidget));
			liWidget.setParent(this);
		},
		
		before: function(liWidget, nextWidget) {
			nextWidget.getUI().parent().before(this.createListItem(liWidget));
			liWidget.setParent(this);
		},
		
		clear: function() {
			this.list.empty();
			this.listItems.clear();
		},
		
		createListItem: function(liWidget) {
			var li = jQuery('<li></li>'),
				id = this.config.prefix + 'LstItm-' + this.idCounter;
				
			li.attr('id', id).append(liWidget.getUI());
			li.data('obj', liWidget);
			this.listItems.put(liWidget, li);
			
			this.idCounter += 1;
			
			return li;
		},
		
		edit: function(id, item, newName) {
			var li = this.list.find('#' + id),
				widget = li.data('obj');
			
			widget.attachObject(item);
			widget.setText(newName);
		},
		
		finishLayout : function() {
			this.container = this.list = 
				this.config.type == module.ui.ListType.UNORDERED ?
				jQuery('<ul class="listWidget"></ul>') : 
				jQuery('<ol class="listWidget"></ol>');
			this.list.attr('id', this.config.id)
				.addClass(this.config.cssClass);
			
			if (this.config.sortable) {
				this.list.sortable();
			}
		},
		
		makeSortable: function() {
			this.list.sortable();
		},
		
		remove: function(idOrWidget) {
			var li = null;
			
			if (typeof idOrWidget === 'string') {
				li = this.list.find('#' + idOrWidget);
				var widget = li.data('obj');
				widget.setParent(null);
				this.listItems.remove(widget);
			}
			else if (idOrWidget instanceof module.ui.ListItem) {
				li = this.listItems.remove(idOrWidget);
			}
			
			if (li !== null) {
				li.remove();
			}
		}
	});
		
	module.ui.ListItem = module.ui.Component.extend({
		init: function(options) {
			this._super(options);
		},
		
		attachObject: function(object) {
			this.container.data('obj', object);
		},
		
		data: function(key, value) {
			if (value != null) {
				return this.container.data(key, value);
			}
			else {
				return this.container.data(key);
			}
		},
		
		finishLayout: function() {
			this.container = jQuery('<div></div>');
		},
		
		getAttachedObject: function() {
			return this.container.data('obj');
		},
		
		getId: function() {
			return this.container.parent().attr('id');
		},
		
		getText: function() {
			return this.container.text();
		},
		
		remove: function() {
			this.container.remove();
		},
		
		removeObject: function() {
			this.container.data('obj', null);
		},
		
		setId: function(id) {
			this.container.parent().attr('id', id);
		},
		
		setParent: function(parent) {
			this.parent = parent;
		},
		
		setText: function(text) {
			this.container.text(text);
		}
	});
	
	module.ui.EdtLiWgtDefaultOptions = {
		removable: true,
		editable: true
	};
	
	module.ui.EditableListItem = module.ui.ListItem.extend({
		init: function(options) {
			var newOpts = jQuery.extend({}, module.ui.EdtLiWgtDefaultOptions, options);
			this._super(newOpts);
		},
						
		finishLayout: function() {
			var btnDiv = jQuery('<div class="buttonContainer"></div>'),
				wgt = this;
			
			this.container = jQuery('<div></div>');
			this.title = jQuery('<span></span>');
			
			if (this.config.editable) {
				this.editBtn = jQuery('<button class="editBtn">Edit</button>');
				btnDiv.append(this.editBtn);
			}
			if (this.config.removable) {
				this.removeBtn = jQuery('<button class="removeBtn">Remove</button>');
				btnDiv.append(this.removeBtn);				
			}
			
			this.container.append(this.title).append(btnDiv);
		},
		
		setText: function(text) {
			this.title.text(text);
		}
	});
   
////////////////////////////////////////////////////////////////////////////////
//                     	Convenient List Sidebar Widget                   	  //
////////////////////////////////////////////////////////////////////////////////     
	
	/*
	 * Configuration object for the ListWidget.
	 */
	module.ui.ListWidgetDefaults = {
		name: 'listSBWidget',
		listId: 'list',
		prefix: 'lst',
		title: '',
		instructions: '',
		type: module.ui.ListType.UNORDERED,
		sortable: false
	};
	
	module.ui.ListWidget = module.ui.Widget.extend({
		init: function(options) {
			var newOpts = jQuery.extend({}, module.tools.ListWidgetDefaults, options);
		    this._super(newOpts);
			
			this.items = new Hashtable();		
		},
			    
	    add: function(obj) {			
			var itm = this.items.get(obj.getId());
			if (!itm) {
				var li = this.createListItem();
					
				li.setText(obj.name);
				li.attachObject(obj);
				
				this.bindButtons(li, obj);
				
				this.list.add(li);
				this.items.put(obj.getId(), li);
			
				return li;
			}
			
			return itm;
	    },
		
		bindButtons: function() {
			
		},
		
		clear: function() {
			this.list.clear();
			this.items.clear();
		},
		
		createListItem: function() {
			return new module.ui.EditableListItem();
		},
		
		getOtherHeights: function() {
			return 0;
		},
		
		finishLayout: function() {
			this._super();
			this.title = jQuery('<h1>' + this.config.title + '</h1>');
			this.instructions = jQuery('<p>' + this.config.instructions + '</p>');
			var wgt = this,
				otherElems = this.layoutExtra();
			
			this.list = new module.ui.List({
				id: this.config.listId,
				prefix: this.config.prefix,
				type: this.config.type,
				sortable: this.config.sortable
			});
			
			this.container.append(this.title).append(this.instructions)
				.append(this.list.getUI());
				
			if (otherElems !== null) {
				this.instructions.after(otherElems);
			}
		},
		
		layoutExtra: function() {
			return null;
		},
	    
	    remove: function(obj) {
			var li = this.items.get(obj.getId()),
				retVal = false;
			
			if (li) {
				li.removeObject();
				this.list.remove(li);
				this.items.remove(obj.getId());
				retVal = true;
			}
			
			return retVal;
	    },
		
//		resize: function(maxHeight) {
//			this._super(maxHeight);	
//			var list = this.list.getUI(),	
//				
//			// now determine button container height
//				insHeight = this.instructions.outerHeight(true),
//			
//			// get the header height
//				hdrHeight = this.title.outerHeight(true),
//				
//			// get other heights
//				otherHeight = this.getOtherHeights(),
//			
//			// adjust the list pane height
//			 	listHeight = maxHeight - insHeight - hdrHeight - otherHeight;
//				
//			if (listHeight > 0) {
//				list.height(listHeight);
//			}
//		},
		
		update: function(obj) {
			var li = this.items.get(obj.getId()),
				retVal = false;
			
			if (li) {
				li.setText(obj.name);
				li.attachObject(obj);
				retVal = true;
			}
			
			return retVal;
		}
	});
	
	return module;
})(editor || {}, jQuery);
