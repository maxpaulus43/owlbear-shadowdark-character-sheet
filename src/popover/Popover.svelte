<script lang="ts">
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get("msg");
</script>

<div class="bg-white h-screen w-full flex flex-col justify-center items-center">
  <h2>ShadowDark Notification</h2>
  <div>{msg}</div>
</div>
