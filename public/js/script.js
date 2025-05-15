const submitButton = document.querySelector('.submitButton');
const form = document.querySelector('form');
const table = document.querySelector('table');
const url = 'http://localhost:3000/items'

document.addEventListener('DOMContentLoaded', () => {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      data.forEach(p => {
        constTr(p.name, p.quantity, p.id)
      })
    })
    .catch(error => console.error('Erro ao buscar os itens:', error));
});


submitButton.addEventListener('click', (ev) => {
  ev.preventDefault();

  const name = document.querySelector('#name');
  const quantity = document.querySelector('#quantity');
  const id = document.querySelector('#id');

  if(id.value !== ''){
    editProduct(name.value, Number(quantity.value), Number(id.value))
  } else {
    // Chama a função passando os valores dos inputs
    createProduct(name.value, Number(quantity.value))
      .then(status => {
        console.log("Status da requisição:", status);
      })
      .catch(error => console.error("Erro ao criar o produto:", error));
  }


  // Limpar os campos do formulário após adicionar a linha
  name.value = '';
  quantity.value = '';
  id.value = '';
});

function editBtn(qtd) {
  const edit = document.createElement('button');
  const i = document.createElement('i');
  i.classList.add('fa-solid', 'fa-pen-to-square');
  edit.appendChild(i);

  edit.classList.add('edit-btn');
  edit.dataset.id = qtd;
  edit.title = 'Editar';

  return edit;
}

function deleteBtn(qtd) {
  const del = document.createElement('button');
  const i = document.createElement('i');
  i.classList.add('fa-solid', 'fa-trash');
  del.appendChild(i);

  del.classList.add('delete-btn');
  del.dataset.id = qtd;
  del.title = 'Excluir';

  return del;
}

function constTr(name, quantity, id) {

  const tr = document.createElement('tr');
  tr.classList.add('product-tr', `product-tr-${id}`)

  const prod = document.createElement('td');
  prod.innerText = name;
  prod.style.textAlign = 'left';
  prod.classList.add('prod-td')

  const qty = document.createElement('td');
  qty.innerText = quantity;
  qty.classList.add('qty-td')

  const edit = document.createElement('td');
  edit.appendChild(editBtn(id));
  edit.appendChild(deleteBtn(id));


  tr.appendChild(prod);
  tr.appendChild(qty);
  tr.appendChild(edit);

  table.appendChild(tr);

}

async function createProduct(name, quantity) {

  const data = { name: name, quantity: quantity }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const product = await response.json();
  console.log(product);
  constTr(product.name, product.quantity, product.id);
  showNotification('add');
  return response.status;
}

async function editProduct(name, quantity,id) {

  const data = { name: name, quantity: quantity }

  const response = await fetch(url+'/'+id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const tr = document.querySelector(`.product-tr-${id}`);

  tr.querySelector('.prod-td').innerText = name;
  tr.querySelector('.qty-td').innerText = quantity;
  showNotification('edit');

}

table.addEventListener('click', async (ev) => {

  const btn = ev.target.closest('.delete-btn');
  if (btn) {
    const id = btn.dataset.id;
    try {
      const response = await fetch(url + '/' + id, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Erro ao deletar o item: ' + response.status);
      }
      console.log('Item deletado com sucesso!');

      // Remove a linha que contém o botão clicado
      const tr = btn.closest('tr');
      if (tr) {
        tr.remove();
        showNotification('delete');
      }
      
    } catch (error) {
      console.error(error);
    }
  }

  const edit = ev.target.closest('.edit-btn');
  if (edit) {
    const name = document.querySelector('#name');
    const quantity = document.querySelector('#quantity');
    const id = document.querySelector('#id');

    name.value = edit.closest('tr').querySelector('.prod-td').innerText;
    id.value = edit.className.match(/edit-btn (\d+)/);
    quantity.value = edit.closest('tr').querySelector('.qty-td').innerText;
    const idClass = edit.closest('tr').className.match(/product-tr-(\d+)/)
    id.value = idClass[1];

  }
});

function showNotification(tipo) {
  const notification = document.getElementById('notification');
  if(tipo === 'delete') {
    notification.innerHTML = 'O item foi excluído com sucesso!';
    notification.style.backgroundColor = '#e74c3c'
  } else if (tipo === 'add') {
    notification.innerHTML = 'O item foi criado com sucesso!';
    notification.style.backgroundColor = '#7CBA60';
  } else {
    notification.innerHTML = 'O item foi editado com sucesso!';
    notification.style.backgroundColor = '#7CBA60';
  }
  notification.classList.add('show');

  // Remove a notificação após 3 segundos
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}


// 

/* e74c3c */