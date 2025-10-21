# 🧭 **Projeto Control7 — Backend (Django + MySQL)**

## 📘 Visão geral

O **Control7** é um sistema de controle de vendas reestruturado em **Django (Python)**, substituindo o sistema legado em Java.  
O objetivo principal desta migração é modernizar a arquitetura, tornando o sistema mais **legível, modular, escalável e fácil de integrar** com novas tecnologias.

Atualmente, o projeto conta com:
- **Backend Django**;
- **API REST** com **Django REST Framework (DRF)**;
- **Banco MySQL** (gerenciado via Workbench);
- **Autenticação JWT** (Simple JWT);
- **Swagger e ReDoc** para documentação automática da API.

---

## 📁 Estrutura do Projeto

```
control7_project/
├── apps/
│   ├── clientes/              # (planejado)
│   ├── funcionarios/          # (planejado)
│   ├── fornecedores/          # módulo implementado
│   │   ├── admin.py           # registro no admin
│   │   ├── models.py          # modelo Fornecedor
│   │   ├── serializers.py     # serialização DRF
│   │   ├── views.py           # lógica CRUD da API
│   │   └── urls.py            # rotas da app
├── control7/
│   ├── settings.py            # configurações do Django e banco
│   ├── urls.py                # rotas globais (admin, API, swagger)
│   └── ...
├── manage.py
├── requirements.txt
├── .env                       # variáveis de ambiente
└── README.md
```

---

## 🧱 Dependências Principais

| Pacote | Descrição |
|--------|------------|
| **Django** | Framework principal |
| **djangorestframework (DRF)** | API REST |
| **drf-yasg** | Documentação via Swagger/ReDoc |
| **mysqlclient** | Conector MySQL |
| **python-dotenv** | Gerenciamento do arquivo `.env` |
| **djangorestframework-simplejwt** | Autenticação JWT |
| **pytest / pytest-django** | Testes automatizados |

---

## ⚙️ Configuração do Ambiente Local

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seuusuario/control7_project.git
cd control7_project
```

### 2️⃣ Criar e ativar o ambiente virtual

```bash
python -m venv .venv
```

**Windows PowerShell**
```bash
& .venv\Scripts\activate
```

**Linux/macOS**
```bash
source .venv/bin/activate
```

### 3️⃣ Instalar as dependências

```bash
pip install -r requirements.txt
```

### 4️⃣ Criar e configurar o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o conteúdo:

```env
DEBUG=True
SECRET_KEY=sua_chave_segura

DB_NAME=control7_db
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_HOST=localhost
DB_PORT=3306
```

### 5️⃣ Aplicar migrações do banco

```bash
python manage.py migrate
```

### 6️⃣ Criar superusuário

```bash
python manage.py createsuperuser
```

⚠️ Durante a digitação da senha, nada será exibido (nem asteriscos).  
Basta digitar normalmente e pressionar Enter.

---

## 🚀 Executar o servidor

```bash
python manage.py runserver
```

Acesse:

| Recurso | URL |
|----------|-----|
| **Painel Admin** | http://localhost:8000/admin/ |
| **API Fornecedores** | http://localhost:8000/api/fornecedores/ |
| **Swagger UI** | http://localhost:8000/swagger/ |
| **ReDoc** | http://localhost:8000/redoc/ |

---

## 🔐 Autenticação JWT

A aplicação utiliza autenticação com **JSON Web Tokens (JWT)**.

### Endpoints principais

| Método | Endpoint | Descrição |
|--------|-----------|-----------|
| **POST** | `/api/token/` | Gera Access & Refresh Token |
| **POST** | `/api/token/refresh/` | Atualiza o token |
| **GET** | `/api/fornecedores/` | Endpoint protegido |

### Exemplo de autenticação

**Requisição**
```json
{
  "username": "admin",
  "password": "suasenha"
}
```

**Resposta**
```json
{
  "refresh": "<token_refresh>",
  "access": "<token_access>"
}
```

**Uso do token no cabeçalho:**
```
Authorization: Bearer <token_access>
```

---

## 🌐 Swagger — Documentação Interativa

A documentação da API é gerada automaticamente:

| Tipo | URL |
|------|-----|
| **Swagger UI** | http://localhost:8000/swagger/ |
| **ReDoc** | http://localhost:8000/redoc/ |

---

## 🧾 Testes Automatizados

Para executar todos os testes:

```bash
pytest -v
```

Ou apenas na app de fornecedores:

```bash
pytest apps/fornecedores/
```

---

## 🧱 App de Fornecedores — Estrutura

### Modelo: `Fornecedor`

```python
class Fornecedor(models.Model):
    nome = models.CharField(max_length=100)
    cnpj = models.CharField(max_length=18, unique=True, validators=[validar_cnpj])
    telefone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    endereco = models.CharField(max_length=200, blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)
```

### Endpoints

| Método | Rota | Ação |
|--------|------|------|
| **GET** | `/api/fornecedores/` | Listar fornecedores |
| **POST** | `/api/fornecedores/` | Criar fornecedor |
| **GET** | `/api/fornecedores/{id}/` | Detalhar fornecedor |
| **PUT/PATCH** | `/api/fornecedores/{id}/` | Atualizar fornecedor |
| **DELETE** | `/api/fornecedores/{id}/` | Excluir fornecedor |

---

## 🧠 Boas Práticas Adotadas

- 🔒 `.env` fora do versionamento (`.gitignore`);
- 🧾 Uso de variáveis de ambiente em `settings.py`;
- 🧱 Padrão **MVT** (Model-View-Template);
- ✅ Código modular com **apps por domínio**;
- 🧪 Testes com **pytest**;
- 💡 Integração de **DRF + JWT + Swagger**;
- 🧍 Uso do **Admin Django** para gerenciamento interno.

---

## 🧭 Roadmap — Próximos Passos

| Etapa | Descrição |
|--------|------------|
| 🔹 Módulo Clientes | CRUD e API |
| 🔹 Módulo Vendas | Processamento de pedidos |
| 🔹 Módulo Relatórios | Geração assíncrona com Celery |
| 🔹 Testes automatizados | Cobertura mínima de 70% |
| 🔹 Integração contínua | GitHub Actions / CI-CD |
| 🔹 Dockerização (fase futura) | Containerização e deploy |

---

## 📄 Autores

- **[Seu Nome]** — Desenvolvedor responsável pelo módulo de fornecedores  
- **Equipe Control7**

---

## 📘 Onde manter esta documentação

Durante o desenvolvimento: **README.md** na raiz.  
Quando o projeto crescer: mover para uma pasta `docs/` com subdocumentos.

```
/docs/
├── instalacao.md
├── api.md
└── testes.md
```

E manter apenas um **resumo** no `README.md`.

---

## 🏁 Conclusão

O **projeto Control7 Backend** está configurado com sucesso com:

- Ambiente virtual (.venv);
- Banco MySQL local;
- API REST com DRF;
- Autenticação JWT;
- Documentação interativa via Swagger.

Pronto para expandir para os demais módulos e para o futuro **deploy em produção!**
