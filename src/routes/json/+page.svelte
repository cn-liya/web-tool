<script>
	import { JSONEditor } from 'svelte-jsoneditor';
	import { copy } from '$lib';

	let input = '',
		content = { json: null },
		pretty = false,
		tip = '';

	const check = () => {
		if (!input) {
			content = { json: null };
			return;
		}
		try {
			let obj = JSON.parse(input);
			content = { json: obj };
			tip = '';
		} catch (err) {
			content = { json: null };
			tip = err.message;
		}
	};
	const spread = () => {
		if (!content.json) return;
		input = JSON.stringify(content.json, null, 2);
		pretty = true;
	};
	const compress = () => {
		if (!content.json) return;
		input = JSON.stringify(content.json);
		pretty = false;
	};
	function unMixed(v) {
		if (!v) return v;
		switch (typeof v) {
			case 'string':
				return unString(v);
			case 'object':
				return unOjbect(v);
		}
		return v;
	}
	function unString(v) {
		if ((v.startsWith('[') && v.endsWith(']')) || (v.startsWith('{') && v.endsWith('}'))) {
			try {
				let obj = JSON.parse(v);
				return unOjbect(obj);
			} catch {
				void 0;
			}
		}
		return v;
	}
	function unOjbect(v) {
		let res = {};
		if (Array.isArray(v)) res = [];
		for (let k in v) {
			res[k] = unMixed(v[k]);
		}
		return res;
	}
	const unescape = () => {
		if (content.json) {
			let v = unOjbect(content.json);
			content = { json: v };
			if (pretty) {
				input = JSON.stringify(v, null, 2);
			} else {
				input = JSON.stringify(v);
			}
		}
	};
	const clear = () => {
		input = '';
		content = { json: null };
		pretty = false;
		tip = '';
	};
</script>

<div class="row">
	<button type="button" class="btn-primary" disabled={!input} on:click={spread}>格式化</button>
	<button type="button" disabled={!input} on:click={compress}>压缩</button>
	<button type="button" class="btn-warning" disabled={!input} on:click={unescape}>去转义</button>
	<button type="button" class="btn-success" disabled={!input} on:click={copy(input)}> 复制 </button>
	<button type="button" class="btn-danger" disabled={!input} on:click={clear}>清空</button>
</div>
<div class="row" show={!!tip}>
	<span class="text-error">{tip}</span>
</div>
<div class="row">
	<div class="col">
		<textarea rows="9" placeholder="在此粘贴或输入" bind:value={input} on:change={check}></textarea>
	</div>
	<div class="col">
		<JSONEditor {content} mainMenuBar={false} navigationBar={false} readOnly />
	</div>
</div>
