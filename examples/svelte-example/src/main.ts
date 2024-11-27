import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML += `
  <div class="card">
    <p>
      Edit <code>example/src/main.ts</code> and save to test HMR
    </p>
  </div>
`;
