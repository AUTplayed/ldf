var ldf = {
	notfound: "<div>Page not Found</div>",
	waitselector: "link[rel='stylesheet'],:not(script)[src]",
	pagedir: "/pages",
	nav: function (location) {
		history.pushState(null, "", location);
		ldf.locchange();
	},
	locchange: function (event) {
		var loc = document.location.pathname;
		if (loc == "/") loc = "/index";
		console.log(loc);
		ldf.load(loc);
	},
	load: function (loc) {
		loc = ldf.pagedir + loc + loc + ".html";
		ldf.helpers.request(loc, function (succ, content) {
			if (succ && ldf.notfound !== undefined) {
				ldf.change(content);
			} else {
				ldf.change(ldf.notfound);
			}
		});
	},
	change: function (content) {
		var ldfnode = document.querySelector("#ldf");
		var ldfclone = ldfnode.cloneNode();
		ldfclone.innerHTML = content;
		ldfclone.style.display = "none";
		ldfnode.parentElement.insertBefore(ldfclone, ldfnode);
		ldf.helpers.waitForLoad(ldfclone.querySelectorAll(ldf.waitselector),
			function () {
				ldf.helpers.switch(ldfnode, ldfclone);
			}
		);
		ldf.updatePageLinks();
		ldf.loadScripts(ldfclone);
	},
	updatePageLinks: function () {
		document.querySelectorAll("a").forEach(function (a) {
			a.removeEventListener("click", ldf.helpers.listener);
			a.addEventListener("click", ldf.helpers.listener);
		});
	},
	loadScripts: function (node) {
		node.querySelectorAll("script").forEach(function (old) {
			var src = old.getAttribute("src");
			var parent = old.parentNode;
			parent.removeChild(old);
			var script = document.createElement("script");
			script.setAttribute("src", src);
			parent.appendChild(script);
		});
	},
	helpers: {
		waitForLoad: function (loadings, cb) {
			if (loadings.length > 0) {
				var loadedcounter = 0;
				loadings.forEach(function (loading) {
					loading.onload = function () {
						loadedcounter++;
						if (loadedcounter == loadings.length) {
							cb();
						}
					}
				});
			} else {
				cb();
			}
		},
		switch: function (og, clone) {
			og.remove();
			clone.style.display = "";
		},
		listener: function (e) {
			e.preventDefault();
			ldf.nav(e.target.getAttribute("href"));
		},
		request: function (loc, cb) {
			var req = new XMLHttpRequest();
			req.open("GET", loc);
			req.send();
			req.onreadystatechange = function () {
				if (req.readyState === 4) {
					cb(req.status.toString().startsWith("2"), req.response);
				}
			};
		}
	}
};
onpopstate = ldf.locchange;
onload = ldf.locchange;