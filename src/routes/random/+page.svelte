<script>
	import { copy } from '$lib';

	const chars = new Map([
		['0~9', '0123456789'],
		['a~z', 'abcdefghijklmnopqrstuvwxyz'],
		['A~Z', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
	]);

	let char = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
		length = 16,
		count = 1,
		result = '',
		num = 1,
		nodash = false,
		uuid = '';

	const genOneString = (chars, len) => {
		let res = '';
		for (let i = 0; i < len; i++) {
			res += chars[Math.floor(Math.random() * chars.length)];
		}
		return res;
	};
	const genString = () => {
		let chars = char.join('');
		if (count === 1) {
			result = genOneString(chars, length);
			return;
		}
		let arr = new Array(count);
		for (let i = 0; i < count; i++) {
			arr[i] = genOneString(chars, length);
		}
		result = JSON.stringify(arr);
	};
	const genOneUUID = (rm = false) => {
		let uid = crypto.randomUUID();
		if (rm) return uid.replaceAll('-', '');
		return uid;
	};
	const genUUID = () => {
		if (num === 1) {
			uuid = genOneUUID(nodash);
			return;
		}
		let arr = new Array(num);
		for (let i = 0; i < num; i++) {
			arr[i] = genOneUUID(nodash);
		}
		uuid = JSON.stringify(arr);
	};
</script>

<div class="form-item">
	<div class="form-label">字符集</div>
	<div class="form-content">
		{#each chars as [k, v]}
			<label><input type="checkbox" value={v} bind:group={char} />{k}</label>
		{/each}
	</div>
</div>
<div class="form-item">
	<div class="form-label">长度 / 数量</div>
	<div class="form-content">
		<input type="number" style="width: 80px" min="1" max="128" bind:value={length} /> 字符 &nbsp;
		<input type="number" style="width: 80px" min="1" max="200" bind:value={count} /> 个
		<small>（最大支持单个128字符，批量生成200个）</small>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		<button
			type="button"
			class="btn-primary"
			disabled={char.length === 0 || length < 1 || length > 128 || count < 1 || count > 200}
			on:click={genString}
		>
			生成
		</button>
		<button type="button" class="btn-success" disabled={!result} on:click={copy(result)}>
			复制
		</button>
		<small>基于Math类的伪随机数生成</small>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		<pre>{result}</pre>
	</div>
</div>
{#if crypto.randomUUID}
	<hr />
	<div class="form-item">
		<div class="form-label">UUID</div>
		<div class="form-content">
			<label>
				<input type="number" style="width: 80px" min="1" max="200" bind:value={num} /> 个
			</label>
			<small>（最大支持批量生成200个）</small>
			<label><input type="checkbox" bind:checked={nodash} />去除“-”号</label>
		</div>
	</div>
	<div class="form-item">
		<div class="form-content">
			<button type="button" class="btn-primary" disabled={num < 1 || num > 200} on:click={genUUID}>
				生成
			</button>
			<button type="button" class="btn-success" disabled={!uuid} on:click={copy(uuid)}>
				复制
			</button>
			<small>基于系统随机数生成（v4版本）</small>
		</div>
	</div>
	<div class="form-item">
		<div class="form-content">
			<pre>{uuid}</pre>
		</div>
	</div>
{/if}
