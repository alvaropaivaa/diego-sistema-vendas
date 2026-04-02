import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { addAnamnese, getAnamneseByCliente } from '../../data/store';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Target, 
  HeartPulse, 
  Dumbbell, 
  Salad, 
  Send 
} from 'lucide-react';
import type { Anamnese } from '../../types';

interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  { id: 1, title: 'Dados Pessoais', icon: <User size={20} /> },
  { id: 2, title: 'Objetivos', icon: <Target size={20} /> },
  { id: 3, title: 'Saúde', icon: <HeartPulse size={20} /> },
  { id: 4, title: 'Treino', icon: <Dumbbell size={20} /> },
  { id: 5, title: 'Alimentação', icon: <Salad size={20} /> },
];

export default function AnamneseIntuitiva() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [form, setForm] = useState<Record<string, any>>({
    // Step 1
    nome: user?.nome || '',
    idade: '',
    dataNascimento: '',
    genero: '',
    altura: '',
    pesoAtual: '',
    cidade: '',
    profissao: '',
    email: '',
    whatsapp: '',
    // Step 2
    objetivoPrincipal: '',
    tempoDesejado: '',
    maiorDesafio: '',
    comprometimento: 10,
    // Step 3
    doencas: '',
    medicacao: '',
    cirurgias: '',
    limitacoes: '',
    alcool: '',
    // Step 4
    praticaAtividade: '',
    tempoTreinoRegular: '',
    objetivoTreino: '',
    doresTreino: '',
    // Step 5
    descricaoAlimentacao: '',
    restricoesAlimentares: '',
    preparoComida: '',
    ingestaoAgua: '',
    suplementos: '',
    apetite: '',
    cafeDaManha: '',
    almoco: '',
    jantar: '',
    alimentosNaoGosta: '',
    observacaoGeral: '',
  });

  useEffect(() => {
    async function checkExistence() {
      if (user?.id) {
        const existing = await getAnamneseByCliente(user.id);
        if (existing && existing.status === 'preenchida') {
          navigate('/aluno/dashboard');
        }
      }
      setChecking(false);
    }
    checkExistence();
  }, [user, navigate]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data: Omit<Anamnese, 'id'> = {
        clienteId: user.id,
        data: new Date().toISOString().split('T')[0],
        status: 'preenchida',
        objetivoPrincipal: form.objetivoPrincipal || form.objetivoTreino,
        tempoTreino: form.tempoTreinoRegular,
        lesoes: form.limitacoes,
        doencas: form.doencas,
        medicamentos: form.medicacao,
        alergiasAlimentares: form.restricoesAlimentares,
        cirurgias: form.cirurgias,
        frequenciaDesejada: '',
        nivelAtividade: form.praticaAtividade,
        fumante: false,
        bebidaAlcoolica: form.alcool.toLowerCase().includes('sim'),
        qualidadeSono: '',
        nivelEstresse: '',
        observacoes: form.observacaoGeral,
        ...form // spread all answers into JSONB responses handled by store
      };
      
      await addAnamnese(data);
      navigate('/aluno/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar anamnese. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <div className="anamnese-premium">
      {/* STEPS PREVIEW */}
      <div className="anamnese-steps">
        {STEPS.map(step => (
          <div 
            key={step.id} 
            className={`anamnese-step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
          >
            <div className="step-icon">{currentStep > step.id ? <Check size={16} /> : step.icon}</div>
            <span>{step.title}</span>
          </div>
        ))}
      </div>

      <div className="anamnese-card animate-fadeInUp">
        {/* STEP 1: DADOS PESSOAIS */}
        {currentStep === 1 && (
          <div className="anamnese-section">
            <h2 className="section-title">🧍 Dados Pessoais</h2>
            <div className="form-grid">
              <div className="form-group full">
                <label>Nome Completo *</label>
                <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Seu nome" required />
              </div>
              <div className="form-group">
                <label>Idade *</label>
                <input type="number" value={form.idade} onChange={e => setForm({...form, idade: e.target.value})} placeholder="Ex: 25" required />
              </div>
              <div className="form-group">
                <label>Data de Nascimento *</label>
                <input type="date" value={form.dataNascimento} onChange={e => setForm({...form, dataNascimento: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Gênero *</label>
                <select className="form-select" value={form.genero} onChange={e => setForm({...form, genero: e.target.value})} required>
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Altura (cm) *</label>
                <input type="number" value={form.altura} onChange={e => setForm({...form, altura: e.target.value})} placeholder="Ex: 175" required />
              </div>
              <div className="form-group">
                <label>Peso Atual (kg) *</label>
                <input type="number" step="0.1" value={form.pesoAtual} onChange={e => setForm({...form, pesoAtual: e.target.value})} placeholder="Ex: 75.5" required />
              </div>
              <div className="form-group">
                <label>Cidade/Estado/País *</label>
                <input type="text" value={form.cidade} onChange={e => setForm({...form, cidade: e.target.value})} placeholder="Ex: Gramado, RS" required />
              </div>
              <div className="form-group full">
                <label>Profissão e Rotina de Trabalho *</label>
                <input type="text" value={form.profissao} onChange={e => setForm({...form, profissao: e.target.value})} placeholder="O que você faz e como é seu dia?" required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="seu@email.com" required />
              </div>
              <div className="form-group">
                <label>WhatsApp *</label>
                <input type="tel" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="(11) 99999-9999" required />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: OBJETIVOS */}
        {currentStep === 2 && (
          <div className="anamnese-section">
            <h2 className="section-title">🎯 Objetivos e Motivação</h2>
            <div className="form-group">
              <label>Qual seu objetivo principal com essa consultoria? *</label>
              <textarea value={form.objetivoPrincipal} onChange={e => setForm({...form, objetivoPrincipal: e.target.value})} placeholder="Ex: Perder 5kg, ganhar massa muscular..." rows={3} required />
            </div>
            
            <div className="form-group">
              <label>Em quanto tempo gostaria de alcançar esse objetivo? *</label>
              <div className="options-vertical">
                {['Até 3 meses', '3 a 6 meses', '6 meses a 12 meses'].map(opt => (
                  <button 
                    key={opt}
                    className={`option-btn ${form.tempoDesejado === opt ? 'active' : ''}`}
                    onClick={() => setForm({...form, tempoDesejado: opt})}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Qual seu maior desafio atualmente para manter uma rotina saudável? *</label>
              <textarea value={form.maiorDesafio} onChange={e => setForm({...form, maiorDesafio: e.target.value})} placeholder="Falta de tempo, ansiedade, cansaço..." rows={2} required />
            </div>

            <div className="form-group">
              <label>De 0 a 10, qual seu nível de comprometimento? *</label>
              <div className="scale-horizontal">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <button 
                    key={n}
                    className={`scale-btn ${form.comprometimento === n ? 'active' : ''}`}
                    onClick={() => setForm({...form, comprometimento: n})}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SAUDE */}
        {currentStep === 3 && (
          <div className="anamnese-section">
            <h2 className="section-title">🩺 Saúde Geral</h2>
            <div className="form-group">
              <label>Possui alguma doença diagnosticada? *</label>
              <textarea value={form.doencas} onChange={e => setForm({...form, doencas: e.target.value})} placeholder="Ex: Hipertensão, diabetes, nenhuma..." rows={2} required />
            </div>
            <div className="form-group">
              <label>Faz uso de medicação contínua? Qual(is)? *</label>
              <textarea value={form.medicacao} onChange={e => setForm({...form, medicacao: e.target.value})} placeholder="Liste os remédios ou diga 'não'..." rows={2} required />
            </div>
            <div className="form-group">
              <label>Já realizou alguma cirurgia? Se sim, qual e quando? *</label>
              <textarea value={form.cirurgias} onChange={e => setForm({...form, cirurgias: e.target.value})} placeholder="Data e tipo de cirurgia ou 'não'..." rows={2} required />
            </div>
            <div className="form-group">
              <label>Possui alguma limitação física ou lesão atual/passada? *</label>
              <textarea value={form.limitacoes} onChange={e => setForm({...form, limitacoes: e.target.value})} placeholder="Dores no joelho, costas, etc..." rows={2} required />
            </div>
            <div className="form-group">
              <label>Consome álcool? se sim, com que frequência? *</label>
              <input type="text" value={form.alcool} onChange={e => setForm({...form, alcool: e.target.value})} placeholder="Ex: Não, ou fins de semana" required />
            </div>
          </div>
        )}

        {/* STEP 4: TREINO */}
        {currentStep === 4 && (
          <div className="anamnese-section">
            <h2 className="section-title">🏋️‍♂️ Treinamento e Atividade Física</h2>
            <div className="form-group">
              <label>Pratica atividade física atualmente? Qual tipo e frequência? *</label>
              <input type="text" value={form.praticaAtividade} onChange={e => setForm({...form, praticaAtividade: e.target.value})} placeholder="Ex: Musculação, 3x na semana" required />
            </div>
            <div className="form-group">
              <label>Há quanto tempo treina regularmente? *</label>
              <div className="options-vertical">
                {['Até 01 ano', '01 ano até 03 anos', '03 anos ou mais', 'Mais de 05 anos'].map(opt => (
                  <button 
                    key={opt}
                    className={`option-btn ${form.tempoTreinoRegular === opt ? 'active' : ''}`}
                    onClick={() => setForm({...form, tempoTreinoRegular: opt})}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Possui objetivo com o treino? *</label>
              <input type="text" value={form.objetivoTreino} onChange={e => setForm({...form, objetivoTreino: e.target.value})} placeholder="Ex: Hipertrofia, emagrecimento..." required />
            </div>
            <div className="form-group">
              <label>Sente dores, desconfortos ou cansaço excessivo? *</label>
              <textarea value={form.doresTreino} onChange={e => setForm({...form, doresTreino: e.target.value})} placeholder="Descreva como se sente após o treino..." rows={2} required />
            </div>
          </div>
        )}

        {/* STEP 5: ALIMENTACAO */}
        {currentStep === 5 && (
          <div className="anamnese-section">
            <h2 className="section-title">🍽️ Alimentação</h2>
            
            <div className="form-group">
              <label>Como você descreveria sua alimentação atual? *</label>
              <div className="options-horizontal">
                {['Regular', 'Desorganizada', 'Equilibrada'].map(opt => (
                  <button 
                    key={opt}
                    className={`option-btn ${form.descricaoAlimentacao === opt ? 'active' : ''}`}
                    onClick={() => setForm({...form, descricaoAlimentacao: opt})}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Possui alguma restrição alimentar? *</label>
              <input type="text" value={form.restricoesAlimentares} onChange={e => setForm({...form, restricoesAlimentares: e.target.value})} placeholder="Ex: Intolerância a lactose, vegetariano, etc" required />
            </div>

            <div className="form-group">
              <label>Costuma comer fora ou prepara a própria comida? *</label>
              <div className="options-vertical">
                {['Fora (as vezes)', 'Fora (quase sempre)', 'Preparo a própria comida'].map(opt => (
                  <button 
                    key={opt}
                    className={`option-btn ${form.preparoComida === opt ? 'active' : ''}`}
                    onClick={() => setForm({...form, preparoComida: opt})}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Ingestão diária de água (aproximadamente): *</label>
              <div className="options-horizontal">
                {['1 litro', '1 a 2 litros', 'Mais de 3 litros'].map(opt => (
                  <button 
                    key={opt}
                    className={`option-btn ${form.ingestaoAgua === opt ? 'active' : ''}`}
                    onClick={() => setForm({...form, ingestaoAgua: opt})}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Costuma consumir suplementos? Quais? *</label>
              <input type="text" value={form.suplementos} onChange={e => setForm({...form, suplementos: e.target.value})} placeholder="Ex: Whey, creatina ou 'não'" required />
            </div>

            <div className="form-group">
              <label>Como é seu apetite no dia a dia? *</label>
              <div className="options-horizontal">
                {['Baixo', 'Moderado', 'Alto'].map(opt => (
                  <button 
                    key={opt}
                    className={`option-btn ${form.apetite === opt ? 'active' : ''}`}
                    onClick={() => setForm({...form, apetite: opt})}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Café da Manhã *</label>
                <input type="text" value={form.cafeDaManha} onChange={e => setForm({...form, cafeDaManha: e.target.value})} placeholder="O que você come?" required />
              </div>
              <div className="form-group">
                <label>Almoço *</label>
                <input type="text" value={form.almoco} onChange={e => setForm({...form, almoco: e.target.value})} placeholder="O que você come?" required />
              </div>
              <div className="form-group">
                <label>Jantar *</label>
                <input type="text" value={form.jantar} onChange={e => setForm({...form, jantar: e.target.value})} placeholder="O que você come?" required />
              </div>
              <div className="form-group">
                <label>O que NÃO gosta? *</label>
                <input type="text" value={form.alimentosNaoGosta} onChange={e => setForm({...form, alimentosNaoGosta: e.target.value})} placeholder="Alimentos evitados" required />
              </div>
            </div>

            <div className="form-group">
              <label>Observação importante que devo saber: *</label>
              <textarea value={form.observacaoGeral} onChange={e => setForm({...form, observacaoGeral: e.target.value})} placeholder="Deixe seu recado para o Diego..." rows={2} required />
            </div>
          </div>
        )}

        <div className="anamnese-footer">
          {currentStep > 1 && (
            <button className="btn-prev" onClick={handlePrev}>
              <ChevronLeft size={20} /> Voltar
            </button>
          )}
          
          {currentStep < 5 ? (
            <button className="btn-next" onClick={handleNext}>
              Próximo <ChevronRight size={20} />
            </button>
          ) : (
            <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Salvando...' : (
                <>Finalizar Anamnese <Send size={20} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
