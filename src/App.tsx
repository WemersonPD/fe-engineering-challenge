import DefaultLayout from './components/templates/DefaultLayout'

function App() {
  return <DefaultLayout search={<input type="text" placeholder="Search..." />} sidebar={<nav aria-label="Product filters">Sidebar content</nav>} content={<div>Main content</div>} />
}

export default App
