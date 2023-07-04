/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GObject, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const _ = ExtensionUtils.gettext;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {

    let trackCodeList = {
        '2091Y005274716',
        'LK122279868CN'
    }

    _init() {
        super._init(0.0, _('rParsel Tracker'));

        this.add_child(new St.Icon({
            icon_name: 'face-smile-symbolic',
            style_class: 'system-status-icon',
        }));


        let item = new PopupMenu.PopupMenuItem(_('Info:'));
        // let item = new PopupMenu.PopupMenuItem(_('1'));
        // let item1 = new PopupMenu.PopupMenuItem(_('2'));
        item.connect('activate', () => {
            Main.notify(_(this.getInfo(this.trackCodeList[0])));
            Main.notify(_(this.getInfo(this.trackCodeList[1])));
        });
        this.menu.addMenuItem(item);
    }

    function getInfo(trackCode) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", `https://global.cainiao.com/global/detail.json?mailNos=${trackCode}&lang=ru-RU&language=ru-RU`);
        xhr.send();
        return JSON.parse(xhr.response).module[0].latestTrace.standerdDesc;
    }

    function getTrackCodes() {

    }
});



class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
