<script>
	const PRI = 'PRIVATE',
		PUB = 'PUBLIC';
	const bits = [512, 1024, 2048, 3072, 4096];
	const curves = ['P-256', 'P-384', 'P-521'];

	let name = '*',
		bit = 2048,
		curve = 'P-384',
		prirow = '',
		pripem = '',
		pubrow = '',
		pubpem = '';

	const formatKey = (buf, head) => {
		let row = btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
		let chunk = [`-----BEGIN ${head} KEY-----`];
		for (let i = 0; i < row.length; i += 64) {
			chunk.push(row.slice(i, i + 64));
		}
		chunk.push(`-----END ${head} KEY-----`);
		let pem = chunk.join('\n');
		return [row, pem];
	};
	const exportKey = async (keyPair) => {
		let pri = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
		let pub = await crypto.subtle.exportKey('spki', keyPair.publicKey);
		return [...formatKey(pri, PRI), ...formatKey(pub, PUB)];
	};
	const genRSA = async () => {
		name = '';
		[prirow, pripem, pubrow, pubpem] = ['', '', '', ''];
		let keyPair = await crypto.subtle.generateKey(
			{
				name: 'RSASSA-PKCS1-v1_5',
				modulusLength: bit,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: 'SHA-256'
			},
			true,
			['sign', 'verify']
		);
		[prirow, pripem, pubrow, pubpem] = await exportKey(keyPair);
		name = 'RSA';
	};
	const genECDSA = async () => {
		name = '';
		[prirow, pripem, pubrow, pubpem] = ['', '', '', ''];
		let keyPair = await crypto.subtle.generateKey(
			{
				name: 'ECDSA',
				namedCurve: curve
			},
			true,
			['sign', 'verify']
		);
		[prirow, pripem, pubrow, pubpem] = await exportKey(keyPair);
		name = 'ECDSA';
	};
</script>

{#if crypto.subtle}
	<div class="form-item">
		<div class="form-label">RSA密钥大小(bit)</div>
		<div class="form-content">
			{#each bits as v}
				<label><input type="radio" bind:group={bit} value={v} />{v}</label>
			{/each}
			<button type="button" class="btn-primary" on:click={genRSA} disabled={!name}>生成</button>
		</div>
		<div class="form-content">
			<small>主流编程语言和工具均支持PKCS8私钥和PKIX公钥，不再建议使用PKCS1格式。</small>
		</div>
	</div>
	<div class="form-item">
		<div class="form-label">ECDSA椭圆曲线</div>
		<div class="form-content">
			{#each curves as v}
				<label><input type="radio" bind:group={curve} value={v} />{v}</label>
			{/each}
			<button type="button" class="btn-primary" on:click={genECDSA} disabled={!name}>生成</button>
		</div>
	</div>
	<hr />
	<div class="form-item">
		<div class="form-label">{name} 私钥</div>
		<div class="form-content">
			<pre>{prirow}</pre>
		</div>
	</div>
	<div class="form-item">
		<div class="form-label"></div>
		<div class="form-content">
			<pre>{pripem}</pre>
		</div>
	</div>
	<div class="form-item">
		<div class="form-label">{name} 公钥</div>
		<div class="form-content">
			<pre>{pubrow}</pre>
		</div>
	</div>
	<div class="form-item">
		<div class="form-label"></div>
		<div class="form-content">
			<pre>{pubpem}</pre>
		</div>
	</div>
{:else}
	<p>当前环境不支持浏览器生成密钥</p>
{/if}
