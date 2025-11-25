from pathlib import Path
import environ
import os
# Adicione esta importação para definir o tempo de vida do token
from datetime import timedelta 

# ---------------------------------------------------------------
# Diretório base do projeto
# ---------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------
# Configura leitura do arquivo .env
# ---------------------------------------------------------------
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# ---------------------------------------------------------------
# Configurações principais
# ---------------------------------------------------------------
SECRET_KEY = env('SECRET_KEY')
DEBUG = env.bool('DEBUG', default=False)
ALLOWED_HOSTS = []

# ---------------------------------------------------------------
# Aplicativos Django + projetos
# ---------------------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Terceiros:
    'rest_framework',
    'drf_yasg',    
    'rest_framework.authtoken',
    'corsheaders',
    # 🎯 INSTALAÇÃO CORRETA do Simple JWT
    'rest_framework_simplejwt', 

    # Apps do projeto:
    'apps.clientes',
    'apps.funcionarios',
    'apps.fornecedores',
    'apps.produtos',
    'apps.configuracao',
    'apps.dashboard',
    'apps.vendas',
    #'apps.relatorios',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
# ---------------------------------------------------------------
# Middlewares
# ---------------------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'control7.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
WSGI_APPLICATION = 'control7.wsgi.application'

CORS_ALLOWED_ORIGINS = [
    'http://localhost:8080',
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_ALL_ORIGINS = True


# ---------------------------------------------------------------
# Banco de Dados (MySQL)
# ---------------------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}

# ---------------------------------------------------------------
# Outras Configurações
# ---------------------------------------------------------------
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------------------------------------------------
# Configurações JWT (JSON Web Token) - ADICIONADO PARA CORRIGIR O 401
# ---------------------------------------------------------------
SIMPLE_JWT = {
    # 🎯 CORREÇÃO: Força o uso da SECRET_KEY principal para assinar o token
    'SIGNING_KEY': SECRET_KEY, 
    
    # Tempo de vida dos tokens
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60), 
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),    

    # Algoritmo padrão
    'ALGORITHM': 'HS256',
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'JTI_CLAIM': 'jti',
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}