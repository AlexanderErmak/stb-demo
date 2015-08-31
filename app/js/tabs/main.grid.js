/**
 * Tab content.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Panel    = require('../stb/ui/panel'),
	Button   = require('../stb/ui/button'),
	Grid     = require('../stb/ui/grid'),
	TabItem = require('../stb/ui/tab.item'),
	keys     = require('../stb/keys'),
	gridData = require('./main.grid.data'),
	tab = new TabItem({
		$node: window.pageMainTabGrid
	}),
	gridDataIndex = 0,
	grid1, grid2;


tab.title = 'Grid';


// add random disabled cells
Object.keys(gridData).forEach(function ( key ) {
	gridData[key].raw.forEach(function ( row ) {
		row = row.map(function ( cell ) {
			if ( typeof cell !== 'object' ) {
				cell = {value: cell};
			}
			return cell;
		});
		row.forEach(function ( cell ) {
			if ( Math.random() > 0.7 ) {
				cell.disable = true;
			}
		});
	});
});


tab.add(
	new Button({
		$node: window.pageMainTabGridBtnPrev,
		value: '<< prev grid data',
		events: {
			click: function () {
				var key;

				if ( gridDataIndex > 0 ) {
					gridDataIndex--;
					key = Object.keys(gridData)[gridDataIndex];
					grid1.parent.$node.children[0].innerText = key;
					grid1.init({
						data: gridData[key].raw
					});
				}
			}
		}
	}),

	new Button({
		$node: window.pageMainTabGridBtnNext,
		value: 'next grid data >>',
		events: {
			click: function () {
				var key;

				if ( gridDataIndex < Object.keys(gridData).length - 1 ) {
					gridDataIndex++;
					key = Object.keys(gridData)[gridDataIndex];
					grid1.parent.$node.children[0].innerText = key;
					grid1.init({
						data: gridData[key].raw
					});
				}
			}
		}
	}),

	new Button({
		$node: window.pageMainTabGridBtnCycle,
		value: 'toggle cycle mode',
		events: {
			click: function () {
				grid1.init({
					cycleX: !grid1.cycleX,
					cycleY: !grid1.cycleY
				});
			}
		}
	}),


	new Panel({
		$node: window.pageMainTabGridMain,
		$body: window.pageMainTabGridMainBody,
		children: [
			grid1 = new Grid({
				data: [
					[{value: 1, disable: true}, 2,  3,  4],
					[5, {value: 6, disable: true},  7,  8],
					[9,  10, 11, 12],
					[13, 14, 15, {value: 16, focus: true}]
				],
				render: function ( $cell, data ) {
					$cell.innerHTML = '<div>' + (data.value) + '</div>';
				},
				cycleX: false,
				cycleY: false
			})
		]
	}),

	new Panel({
		$node: window.pageMainTabGridJoin,
		children: [
			grid2 = new Grid({
				data: [
					[1, 2, {value: 3, mark: true}, 4, {value: '5;10;15;20', rowSpan: 4, disable: true}],
					[{value: 6}, {value: '7-9', colSpan: 3, disable: true}],
					[{value: '11;12;16;17', rowSpan: 2, colSpan: 2, disable: true}, {value: 13, mark: true}, 14],
					[18, 19],
					[{value: '21-25', colSpan: 5}],
					[{value: '26-35', colSpan: 5, rowSpan: 2}]
				],
				events: {
					'click:item': function ( data ) {
						grid2.markItem(data.$item, !data.$item.data.mark);
					}
				},
				navigate: function ( event ) {
					if ( event.code === keys.up    ) { this.move(keys.down); }
					if ( event.code === keys.down  ) { this.move(keys.up); }
					if ( event.code === keys.right ) { this.move(keys.left); }
					if ( event.code === keys.left  ) { this.move(keys.right); }
				}
			})
		]
	})
);


// public
module.exports = tab;
