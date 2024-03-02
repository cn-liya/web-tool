<script>
	import CryptoJS from 'crypto-js';
	import { message, copy } from '$lib';

	const mimetypes = [
		'application/pdf',
		'image/gif',
		'image/png',
		'image/jpeg',
		'image/bmp',
		'image/webp',
		'image/x-icon',
		'image/svg+xml',
		'audio/mpeg',
		'audio/ogg',
		'audio/wav',
		'video/mp4',
		'video/webm',
		'video/ogg'
	];

	let utf8 = '',
		base64 = '',
		files = [],
		fileBase64 = '',
		mimetype = '',
		dataURL = '';

	const encode = () => {
		if (!utf8) return;
		base64 = '';
		let res = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(utf8));
		base64 = res;
	};
	const decode = () => {
		if (!base64) return;
		utf8 = '';
		try {
			let res = CryptoJS.enc.Base64.parse(base64).toString(CryptoJS.enc.Utf8);
			utf8 = res;
		} catch {
			message.error('解码失败');
		}
	};
	const clearText = () => {
		utf8 = '';
		base64 = '';
	};
	const readFile = (e) => {
		if (e.target.files.length < 1) return;
		let file = e.target.files[0];
		e.target.value = null;
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			let res = reader.result;
			let i = res.indexOf(':'),
				j = res.indexOf(';'),
				k = res.indexOf(',');
			if (i > 0 && j > 0 && k > 0) {
				let mt = res.slice(i + 1, j);
				if (mimetypes.includes(mt)) {
					mimetype = mt;
				} else {
					mimetype = '';
				}
				fileBase64 = res.slice(k + 1);
			}
		};
	};
	const clearFile = () => {
		files = [];
		fileBase64 = '';
		mimetype = '';
		dataURL = '';
	};
	const preview = () => {
		dataURL = 'data:' + mimetype + ';base64,' + fileBase64;
	};
</script>

<div class="form-item">
	<div class="form-label">utf8</div>
	<div class="form-content">
		<textarea bind:value={utf8}></textarea>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		<button type="button" class="btn-primary" disabled={!utf8} on:click={encode}> 编码 ⇓ </button>
		<button type="button" disabled={!base64} on:click={decode}>解码 ⇑</button>
		<button type="button" class="btn-danger" disabled={!utf8 && !base64} on:click={clearText}>
			清空
		</button>
	</div>
</div>
<div class="form-item">
	<div class="form-label">base64</div>
	<div class="form-content">
		<textarea bind:value={base64}></textarea>
	</div>
</div>
<hr />
<div class="form-item">
	<div class="form-label">读取文件</div>
	<div class="form-content">
		<div>
			<label class="btn">选择文件<input type="file" bind:files on:change={readFile} /></label>
			<span>{files.length > 0 ? files[0].name : ''}</span>
		</div>
	</div>
</div>
<div class="form-item">
	<div class="form-label">base64编码</div>
	<div class="form-content">
		<textarea bind:value={fileBase64}></textarea>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		<button type="button" class="btn-success" disabled={!fileBase64} on:click={copy(fileBase64)}>
			复制
		</button>
		<button type="button" class="btn-danger" disabled={!fileBase64} on:click={clearFile}>
			清空
		</button>
		<button
			type="button"
			class="btn-warning"
			disabled={!fileBase64 || !mimetype}
			on:click={preview}
		>
			预览
		</button>
		<select bind:value={mimetype}>
			<option value="">未知类型</option>
			{#each mimetypes as v}
				<option value={v}>{v}</option>
			{/each}
		</select>
		<small>预览需编码和媒体类型相匹配</small>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		<object show={!!dataURL} type={mimetype} data={dataURL} title="Preview">
			解码失败或浏览器不支持预览
		</object>
	</div>
</div>
