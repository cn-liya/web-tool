<script>
	import CryptoJS from 'crypto-js';
	import { message } from '$lib';

	const algos = new Map([
		['AES', CryptoJS.AES],
		['DES', CryptoJS.DES],
		['3DES', CryptoJS.TripleDES]
	]);
	const modes = new Map([
		['ECB', { padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.ECB }],
		['CBC', { padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC }],
		['CFB', { padding: CryptoJS.pad.NoPadding, mode: CryptoJS.mode.CFB }],
		['OFB', { padding: CryptoJS.pad.NoPadding, mode: CryptoJS.mode.OFB }],
		['CTR', { padding: CryptoJS.pad.NoPadding, mode: CryptoJS.mode.CTR }]
	]);
	const encs = new Map([
		['Utf8', CryptoJS.enc.Utf8],
		['Base64', CryptoJS.enc.Base64],
		['Base64url', CryptoJS.enc.Base64url],
		['Hex', CryptoJS.enc.Hex]
	]);

	let algo = 'AES',
		mode = 'ECB',
		key = '',
		iv = '',
		enc = 'Utf8',
		plainText = '',
		cipherText = '';

	const precheck = () => {
		let encoder = encs.get(enc);
		if (!encoder) return null;
		let options = {};
		if (mode !== 'ECB') {
			options.iv = encoder.parse(iv);
		}
		let cipherKey = encoder.parse(key);
		switch (algo) {
			case 'AES':
				if (cipherKey.sigBytes !== 16 && cipherKey.sigBytes !== 24 && cipherKey.sigBytes !== 32) {
					message.warning('密钥必须为16/24/32字节');
					return null;
				}
				if (options.iv && options.iv.sigBytes !== 16) {
					message.warning('向量必须为16字节');
					return null;
				}
				break;
			case 'DES':
				if (cipherKey.sigBytes !== 8) {
					message.warning('密钥必须为8字节');
					return null;
				}
				if (options.iv && options.iv.sigBytes !== 8) {
					message.warning('向量必须为8字节');
					return null;
				}
				break;
			case '3DES':
				if (cipherKey.sigBytes !== 24) {
					message.warning('密钥必须为24字节');
					return null;
				}
				if (options.iv && options.iv.sigBytes !== 8) {
					message.warning('向量必须为8字节');
					return null;
				}
				break;
			default:
				return null;
		}
		return {
			algo: algos.get(algo),
			key: cipherKey,
			options: { ...options, ...modes.get(mode) }
		};
	};
	const encrypt = () => {
		cipherText = '';
		let p = precheck();
		if (!p) return;
		let res = p.algo.encrypt(plainText, p.key, p.options).toString();
		cipherText = res;
	};
	const decrypt = () => {
		plainText = '';
		let p = precheck();
		if (!p) return;
		try {
			let res = p.algo.decrypt(cipherText, p.key, p.options).toString(CryptoJS.enc.Utf8);
			plainText = res;
		} catch {
			message.error('解密失败');
		}
	};
</script>

<div class="form-item">
	<div class="form-label">算法</div>
	<div class="form-content">
		{#each algos as [k]}
			<label><input type="radio" bind:group={algo} value={k} />{k}</label>
		{/each}
	</div>
</div>
<div class="form-item">
	<div class="form-label">工作模式</div>
	<div class="form-content">
		{#each modes as [k]}
			<label><input type="radio" bind:group={mode} value={k} />{k}</label>
		{/each}
	</div>
	<div class="form-content">
		<small>块模式ECB/CBC使用pkcs7填充，流模式CFB/OFB/CTR不填充</small>
	</div>
</div>
<div class="form-item">
	<div class="form-label">密钥 / 向量</div>
	<div class="form-content nowrap">
		<select bind:value={enc}>
			{#each encs as [k]}
				<option value={k}>{k}</option>
			{/each}
		</select>
		<input type="text" placeholder="key" bind:value={key} />
		<input type="text" placeholder="iv" visible={mode !== 'ECB'} bind:value={iv} />
	</div>
</div>
<div class="form-item">
	<div class="form-label">明文</div>
	<div class="form-content">
		<textarea bind:value={plainText}></textarea>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		<button type="button" class="btn-primary" on:click={encrypt}>加密 ⇓</button>
		<button type="button" on:click={decrypt}>解密 ⇑</button>
	</div>
</div>
<div class="form-item">
	<div class="form-label">密文</div>
	<div class="form-content">
		<textarea bind:value={cipherText}></textarea>
	</div>
</div>
