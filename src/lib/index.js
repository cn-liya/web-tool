class Message {
	#msg(text, theme, duration) {
		let node = document.createElement('div');
		node.setAttribute('class', 'msg ' + theme);
		node.innerText = text;
		let body = document.querySelector('body');
		body.appendChild(node);
		setTimeout(() => {
			body.removeChild(node);
		}, duration || 3000);
	}
	success(text, duration = 3000) {
		this.#msg(text, 'success', duration);
	}
	info(text, duration = 3000) {
		this.#msg(text, 'info', duration);
	}
	warning(text, duration = 3000) {
		this.#msg(text, 'warning', duration);
	}
	error(text, duration = 3000) {
		this.#msg(text, 'error', duration);
	}
}

const message = new Message();

const copy = (text) => {
	if (!navigator.clipboard) {
		message.warning('当前环境不支持一键复制，请手动复制');
		return;
	}
	navigator.clipboard
		.writeText(text)
		.then(() => {
			message.success('复制成功');
		})
		.catch(() => {
			message.error('复制失败，请手动复制');
		});
};

export { message, copy };
