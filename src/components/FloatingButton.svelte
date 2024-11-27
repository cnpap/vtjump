<script lang="ts">
  let showModal = false;
</script>

<style>
  .floating-btn {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 50px;
    height: 50px;
    background: #4a90e2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    transition: transform 0.2s;
  }

  .floating-btn:hover {
    transform: scale(1.1);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 300px;
    max-width: 600px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    color: #666;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #000;
  }

  .modal-content {
    color: #333;
  }
</style>

<div class="floating-btn" on:click={() => (showModal = true)}>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
</div>

{#if showModal}
  <div class="modal-overlay" on:click|self={() => (showModal = false)}>
    <div class="modal">
      <div class="modal-header">
        <h2>VTJump Modal</h2>
        <button class="close-btn" on:click={() => (showModal = false)}>×</button>
      </div>
      <div class="modal-content">
        <p>This is the modal content.</p>
      </div>
    </div>
  </div>
{/if}
