<script>
	import CryptoJS from 'crypto-js';
	import { copy } from '$lib';

	const algos = new Map([
		['MD5', CryptoJS.MD5],
		['SHA1', CryptoJS.SHA1],
		['SHA224', CryptoJS.SHA224],
		['SHA256', CryptoJS.SHA256],
		['SHA384', CryptoJS.SHA384],
		['SHA512', CryptoJS.SHA512],
		['HmacMD5', CryptoJS.HmacMD5],
		['HmacSHA1', CryptoJS.HmacSHA1],
		['HmacSHA224', CryptoJS.HmacSHA224],
		['HmacSHA256', CryptoJS.HmacSHA256],
		['HmacSHA384', CryptoJS.HmacSHA384],
		['HmacSHA512', CryptoJS.HmacSHA512]
	]);
	const srcs = ['text', 'file'];
	const encs = new Map([
		['Hex', CryptoJS.enc.Hex],
		['Base64', CryptoJS.enc.Base64],
		['Base64url', CryptoJS.enc.Base64url]
	]);

	let algo = 'MD5',
		key = '',
		src = 'text',
		text = '',
		files = [],
		enc = 'Hex',
		result = '';

	const readBytes = (file) =>
		new Promise((resolve) => {
			const reader = new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onload = () => {
				resolve(CryptoJS.lib.WordArray.create(reader.result));
			};
		});
	const submitForm = async (event) => {
		event.preventDefault();
		let encoder = encs.get(enc);
		if (!encoder) return;
		let msg;
		if (src === 'text') {
			msg = text;
		} else if (files.length > 0) {
			msg = await readBytes(files[0]);
		}
		let params = [msg];
		if (algo.startsWith('Hmac')) {
			params.push(key);
		}
		let fn = algos.get(algo);
		if (fn) {
			result = fn(...params).toString(encoder);
		}
	};
</script>

<form on:submit={submitForm}>
	<div class="form-item">
		<div class="form-label">算法</div>
		<div class="form-content">
			{#each algos as [k]}
				<label><input type="radio" bind:group={algo} value={k} />{k}</label>
			{/each}
		</div>
	</div>
	<div class="form-item" show={algo.startsWith('Hmac')}>
		<div class="form-label">密钥</div>
		<div class="form-content">
			<input type="text" bind:value={key} />
		</div>
	</div>
	<div class="form-item">
		<div class="form-label">来源类型</div>
		<div class="form-content">
			{#each srcs as v}
				<label><input type="radio" bind:group={src} value={v} />{v}</label>
			{/each}
		</div>
	</div>
	<div class="form-item">
		<div class="form-label">来源内容</div>
		<div class="form-content">
			<textarea bind:value={text} show={src === 'text'}></textarea>
			<div show={src === 'file'}>
				<label class="btn">选择文件<input type="file" bind:files /></label>
				<span>{files.length > 0 ? files[0].name : ''}</span>
			</div>
		</div>
	</div>
	<div class="form-item">
		<div class="form-label">输出编码</div>
		<div class="form-content">
			<select bind:value={enc}>
				{#each encs as [k]}
					<option value={k}>{k}</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="form-item">
		<div class="form-content">
			<button type="submit" class="btn-primary">确定</button>
			<button type="button" class="btn-success" disabled={!result} on:click={copy(result)}>
				复制
			</button>
		</div>
	</div>
	<div class="form-item">
		<div class="form-label">计算结果</div>
		<div class="form-content">
			<pre>{result}</pre>
		</div>
	</div>
</form>
