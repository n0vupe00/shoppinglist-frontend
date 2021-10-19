import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'http://localhost/shoplist/';

function App() {

  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [amount, setAmount] = useState('');
  const [amounts, setAmounts] = useState([]);

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setTasks(response.data);
        setAmounts(response.data);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }, []);

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({ description: task, amount: amount })
    axios.post(URL + 'add.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        console.log(response);
        setTasks(tasks => [...tasks, response.data]);
        setAmounts(amounts => [...amounts, response.data])
        setTask('');
        setAmount('');
      }).catch(error => {
        alert(error.response.data.error)
      });
  }

  function remove(id) {
    const json = JSON.stringify({ id: id })
    axios.post(URL + 'delete.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = tasks.filter((item) => item.id !== id);
        const newAmountListWithoutRemoved = amounts.filter((item) => item.id !== id);
        setTasks(newListWithoutRemoved);
        setAmounts(newAmountListWithoutRemoved);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      });
  }

  return (
    <div className="container">
      <h3>Shopping List</h3>
      <form onSubmit={save}>
        <label> New item </label>
        <input value={task} onChange={e => setTask(e.target.value)} placeholder="Item" />
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <button>Add</button>
      </form>
      <ul>
        {tasks?.map(task => (
          <li key={task.id}>{task.description}</li>
        ))}
      </ul>
      <ul>
        {amounts?.map(amount => (
          <li key={amount.id}>{amount.amount}
          <a href="#" className="delete" onClick={() => remove(amount.id)}> Delete</a>
          </li>
        ))}
      </ul>


    </div>
  );
}

export default App;
