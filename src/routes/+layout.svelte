<script>
	import { page } from '$app/stores';
	import menu from '$lib/menu';
</script>

<svelte:head>
	<title>{menu.get($page.url.pathname)?.title || '实用在线工具'}</title>
	<meta name="description" content={menu.get($page.url.pathname)?.description} />
	<meta name="keywords" content={menu.get($page.url.pathname)?.keywords} />
</svelte:head>

<nav>
	<ul>
		{#each menu as [key, value]}
			<li aria-current={$page.url.pathname === key ? 'page' : undefined}>
				<a href={key}>{key === '/' ? '🏠' : '🔖'} {value.title}</a>
			</li>
		{/each}
	</ul>
</nav>
<main>
	<section>
		<slot />
	</section>
</main>

<style>
	nav {
		position: fixed;
		width: 290px;
		height: 100vh;
		border-right: 1px solid var(--border-light);
		overflow: hidden auto;
		scrollbar-width: none;
		&:hover {
			scrollbar-width: thin;
		}
		& > ul > li {
			line-height: 48px;
			white-space: nowrap;
			transition: 0.3s;
			&:hover {
				color: var(--blue);
			}
			&[aria-current='page'] {
				color: var(--blue);
				background-color: var(--blue-fill);
			}
			& > a {
				display: inline-block;
				width: 100%;
				text-indent: 12px;
			}
		}
	}
	main {
		position: absolute;
		right: 0;
		width: calc(100% - 291px);
		min-height: 100vh;
		& > section {
			margin: 16px;
		}
	}
</style>
