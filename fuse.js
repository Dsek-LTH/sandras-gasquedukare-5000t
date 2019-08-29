const { FuseBox, SassPlugin, CSSPlugin } = require("fuse-box");
const path = require("path");
const express = require("express");

const fuse = FuseBox.init({
	homeDir: "src",
	output: "dist/$name.js",
	plugins: [
		[SassPlugin(), CSSPlugin()]
	],
	sourceMaps: true
});

fuse
	.bundle("app")
	.instructions(`> index.tsx`)
	.watch()
	.hmr();

fuse.dev({ root: false }, server => {
	const dist = path.resolve("./dist");
	const static = path.resolve("./static");

	const app = server.httpServer.app;
	app.use("/dist/", express.static(dist));
	app.use("/", express.static(static));
});

fuse.run();
