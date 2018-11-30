function small() {
    var fontsize = document.createElement('style');
    fontsize.innerHTML = '#header {font-size: 14px} body {font-size: 12px} .options, .uninstall, .info, .hide {font-size: 11px}';
    document.body.appendChild(fontsize);
};

function medium() {
    var fontsize = document.createElement('style');
    fontsize.innerHTML = '#header {font-size: 15px} body {font-size: 13px} .options, .uninstall, .info, .hide {font-size: 12px}';
    document.body.appendChild(fontsize);
};

function large() {
    var fontsize = document.createElement('style');
    fontsize.innerHTML = '#header {font-size: 16px} body {font-size: 14px} .options, .uninstall, .info, .hide {font-size: 13px}';
    document.body.appendChild(fontsize);
};

function gutter() {
    var styleGut = document.createElement('style');
    styleGut.innerHTML = '#header {padding: 16px 20px 11px;} .extension, #menu {padding: 5px 15px 5px 20px;} #txtdiv {padding: 0 15px 0 20px} .extension.dev div::before {content:"$"} .extension.out div::before {content:"[]"}';
    document.body.appendChild(styleGut);
};

function rmMenu() {
    const thisMenu = document.getElementById('menu');
    const thisInfo = document.getElementById('txtdiv');
    const ext = document.querySelector(".expanded");
    if (thisMenu) {
        thisMenu.outerHTML = '';
    }
    if (thisInfo) {
        thisInfo.outerHTML = '';
    }
    if(ext){
        ext.classList.remove("expanded");
    }
};

function options() {
    chrome.runtime.openOptionsPage();
};

function setup() {
    chrome.storage.sync.get({
        'width': '195',
        'fontsize': 'medium',
        'os': ''
    }, function(start) {
        const fontsize = start.fontsize;
        if (fontsize === 'small') {
            small();
        }
        else if (fontsize === 'medium') {
            medium();
        }
        else {
            large();
        }
    });
};

function load() {
    chrome.management.getAll(function(info) {
        console.log(info);
        info.sort(function (a,b) {
            return a.shortName.trim().localeCompare(b.shortName.trim());
        });
        chrome.storage.sync.get({'hidden': []}, function(comp) {
            hidden = comp.hidden;
            const thisID = chrome.runtime.id;
            var present = [];
            for (i=0; i<info.length; i++) {
                if (info[i].type === 'extension' && info[i].id !== thisID) {
                    extID = info[i].id;
                    present.push(extID);
                    if (hidden.indexOf(info[i].id) === -1) {
                        extItem = document.createElement('div');
                        extItem.classList.add('extension');
                        if (info[i].updateUrl == null) {
                            extItem.classList.add('out');
                        }
                        if (info[i].installType === 'development') {
                            extItem.classList.remove('out');
                            extItem.classList.add('dev');
                        }
                        if (info[i].enabled === true) {
                            extItem.classList.add('enabled');
                        }
                        extItem.setAttribute('id', extID);
                        let permissions = `<ul class="permissions">`;
                        info[i].permissions.forEach(permission => {
                            permissions += `<li>${permission}</li>`;
                        });
                        info[i].hostPermissions.forEach(permission => {
                            permissions += `<li>${permission}</li>`;
                        });
                        permissions += `</ul>`;
                        let icon = info[i].icons ? info[i].icons[0].url : "data:image/png;base64,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";
                        let checked = info[i].enabled ? "checked" : "";
                        let options = info[i].optionsUrl ? `<a class="options" href="${info[i].optionsUrl}">Options</a>` : "";
                        let homepage = info[i].homepageUrl ? `<a class="homepage" href="${info[i].homepageUrl}">Homepage</a>` : "";
                        let install = info[i].installType!=="normal" ? `(${info[i].installType})` : "";
                        extItem.innerHTML = `
                            <div class="header">
                                <img class="icon" src="${icon}" />
                                <div class="name">${info[i].name}</div>
                                <input type="checkbox" tabindex="-1" ${checked}></input>
                            </div>
                            <div class="details">
                                <div class="version" title="Version">${info[i].version} ${install}</div>
                                <div class="description" title="Description">${info[i].description}</div>
                                <div class="id" title="ID">${info[i].id}</div>
                                <div class="links">${options} ${homepage}</div>
                                ${permissions}
                                <!-- * Inspect Views (background page inspect launch?) -->
                            </div>
                        `;
                        switcher.appendChild(extItem);
                    }
                }
            }
            var remove = hidden.filter(e => !present.includes(e));
            hidden = hidden.filter(e => !remove.includes(e));
            chrome.storage.sync.set({'hidden': hidden});
            run();
        });
    });
};

function run() {
    const extensionInputs = document.querySelectorAll('.extension input');
    const extensions = document.querySelectorAll('.extension');
    for (i=0; i<extensions.length; i++) {
        extensionInputs[i].addEventListener('input', function(event){
            rmMenu();
            extID = event.target.parentElement.parentElement.getAttribute('id');
            chrome.management.setEnabled(extID, event.target.checked);
            if (event.target.checked) {
                event.target.parentElement.parentElement.classList.add('enabled');
            } else {
                event.target.parentElement.parentElement.classList.remove('enabled');
            }
        });

        extensions[i].addEventListener('contextmenu', function(i) {
            event.preventDefault();
            rmMenu();
            extID = extensions[i].getAttribute('id');
            menu = document.createElement('div');
            menu.id = 'menu';
            extensions[i].appendChild(menu);
            extensions[i].classList.add("expanded");

            // hide
            var hide = document.createElement('span');
            hide.classList.add('hide');
            hide.innerHTML = 'Hide';
            menu.appendChild(hide);
            hide.addEventListener('click', function() {
                chrome.storage.sync.get({'hidden': ''}, function(arr) {
                    hidden = arr.hidden;
                    hidden.push(extID);
                    chrome.storage.sync.set({'hidden': hidden}, function() {
                        rmMenu();
                        extensions[i].style.display = 'none';
                        chrome.runtime.sendMessage('hide it!');
                    });
                });
            });

            // uninstall
            var unInst = document.createElement('span');
            unInst.classList.add('uninstall');
            unInst.innerHTML = 'Uninstall';
            menu.appendChild(unInst);
            unInst.addEventListener('click', function() {
                chrome.management.uninstall(extID, function() {
                    if (chrome.runtime.lastError) {
                        extensions[i].style.display = 'block';
                    }
                    else {
                        rmMenu();
                        extensions[i].style.display = 'none';
                    }
                });
            });
        }.bind(this, i));
    }
};

hidden = [];
setup();
load();
document.getElementById('switcher').addEventListener('mouseleave', rmMenu);
