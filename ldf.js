var ldf = {
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
		loc = "/pages" + loc + loc + ".html";
		ldf.helpers.request(loc, function (succ, content) {
			if (succ) {
				ldf.change(content);
			} else {
				ldf.change("<div>Page not Found</div>");
			}
		});
	},
	change: function (content) {
		var ldfnode = document.querySelector("#ldf");
		ldfnode.innerHTML = content;
		ldf.updatePageLinks();
		ldf.loadScripts(ldfnode);
	},
	updatePageLinks: function () {
		document.querySelectorAll("a").forEach(function (a) {
			a.removeEventListener("click", ldf.helpers.listener)
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
			}
		}
	}
};
onpopstate = ldf.locchange;
onload = ldf.locchange;