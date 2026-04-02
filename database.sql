-- Esquema de Banco de Dados Supabase para Diego Sistema de Vendas

-- Permitir extension uuid-ossp (se necessário, geralmente no Supabase já é habilitado por padrão)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABELA: clientes
-- ==========================================
CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    data_nascimento DATE,
    objetivo TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    data_inicio DATE DEFAULT CURRENT_DATE,
    observacoes TEXT,
    foto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: treinos
-- ==========================================
CREATE TABLE public.treinos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    tipo TEXT,
    dias_semana JSONB DEFAULT '[]'::jsonb, -- Array de strings ex: ["Seg", "Ter"]
    grupos JSONB DEFAULT '[]'::jsonb,     -- JSON complexo contendo os exercícios para não precisar criar 3 tabelas de relacionamento e over-engeneering
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: dietas
-- ==========================================
CREATE TABLE public.dietas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    objetivo TEXT,
    refeicoes JSONB DEFAULT '[]'::jsonb,  -- Array de refeicoes e alimentos estruturados num JSON para simplificação no frontend
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    ativa BOOLEAN DEFAULT true,
    total_calorias TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: checkins
-- ==========================================
CREATE TABLE public.checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    data TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'preenchida')),
    respostas JSONB DEFAULT '{}'::jsonb, -- Salvamos todas as outras mais de 20 colunas em formato JSON por praticidade para adicionar/remover
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: mensagens
-- ==========================================
CREATE TABLE public.mensagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    remetente_id TEXT NOT NULL,      -- Pode ser um UUID de cliente ou a string 'trainer'
    destinatario_id TEXT NOT NULL,   -- Pode ser um UUID de cliente ou a string 'trainer'
    conteudo TEXT NOT NULL,
    data_envio TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    lida BOOLEAN DEFAULT false,
    tipo TEXT CHECK (tipo IN ('trainer', 'aluno')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: anamneses
-- ==========================================
CREATE TABLE public.anamneses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    data TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'preenchida')),
    respostas JSONB DEFAULT '{}'::jsonb, -- Restante dos dados da anamnese
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: pagamentos
-- ==========================================
CREATE TABLE public.pagamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    valor NUMERIC(10, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pago', 'pendente', 'atrasado')),
    mes_referencia TEXT NOT NULL,
    forma_pagamento TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: configuracoes
-- ==========================================
CREATE TABLE public.configuracoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_trainer TEXT,
    meta_mensal INTEGER,
    valor_mensalidade NUMERIC(10, 2),
    horario_inicio TEXT,
    horario_fim TEXT,
    dias_trabalho JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir as configurações iniciais
INSERT INTO public.configuracoes (nome_trainer, meta_mensal, valor_mensalidade, horario_inicio, horario_fim, dias_trabalho)
VALUES ('Diego Haubricht', 50, 150, '06:00', '22:00', '["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]'::jsonb);

-- Nota: Como o sistema atual usa ID em string "gerado na mão" via `Date.now().toString()`, o sistema lidará com UUIDs.
-- As regras RLS (Row Level Security) precisam ser desativadas OU criadas políticas corretas no Supabase caso for usar sem Auth.
-- Desabilitando RLS para simplificar a prova de conceito (na prática, ative-as e use Políticas (Policies)):

ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.treinos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.dietas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.anamneses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes DISABLE ROW LEVEL SECURITY;
