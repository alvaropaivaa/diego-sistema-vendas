import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { addCheckin } from '../../data/store';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import type { Checkin } from '../../types';

type QuestionType = 'scale' | 'boolean' | 'options' | 'text' | 'number' | 'textarea';

interface Question {
  id: keyof Omit<Checkin, 'id' | 'clienteId' | 'data' | 'status'>;
  title: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
}

const QUESTIONS: Question[] = [
  { id: 'adesaoTreino', type: 'scale', title: 'De 1 a 10, qual foi sua adesão aos treinos?' },
  { id: 'adesaoDieta', type: 'scale', title: 'De 1 a 10, qual foi sua adesão à dieta?' },
  { id: 'adesaoSuplementacao', type: 'scale', title: 'De 1 a 10, como foi o uso da suplementação?' },
  { id: 'frequenciaTreino', type: 'number', title: 'Quantas vezes você treinou na semana?', placeholder: 'Ex: 5' },
  { id: 'faltouTreino', type: 'boolean', title: 'Você faltou algum treino programado?' },
  { id: 'evolucaoCarga', type: 'boolean', title: 'Você conseguiu aumentar pesos ou repetições?' },
  { id: 'intensidadeTreino', type: 'options', title: 'Como você avalia a intensidade dos seus treinos?', options: ['Baixa', 'Média', 'Alta'] },
  { id: 'dificuldadeExercicios', type: 'boolean', title: 'Teve dificuldade na execução de algum exercício?' },
  { id: 'dorDesconforto', type: 'boolean', title: 'Sentiu alguma dor ou desconforto incomum?' },
  { id: 'nivelEnergia', type: 'options', title: 'Como esteve seu nível de energia no treino?', options: ['Baixa', 'Média', 'Alta'] },
  { id: 'nivelMotivacao', type: 'options', title: 'Qual foi o seu nível de motivação?', options: ['Baixa', 'Média', 'Alta'] },
  { id: 'evolucaoFisica', type: 'boolean', title: 'Notou alguma evolução física no espelho?' },
  { id: 'seguiuDieta', type: 'boolean', title: 'Você seguiu a dieta 100%?' },
  { id: 'furosDieta', type: 'boolean', title: 'Houve escapadas (refeições livres)?' },
  { id: 'nivelFome', type: 'options', title: 'Qual seu nível de fome durante a quinzena?', options: ['Muita Fome', 'Controlada', 'Pouca Fome'] },
  { id: 'horasSono', type: 'number', title: 'Quantas horas você dorme em média?', placeholder: 'Ex: 8' },
  { id: 'qualidadeSono', type: 'options', title: 'Como está a qualidade do seu sono?', options: ['Ruim', 'Regular', 'Boa'] },
  { id: 'nivelEstresse', type: 'options', title: 'Qual o seu nível de estresse diário?', options: ['Baixo', 'Médio', 'Alto'] },
  { id: 'usouSuplementacao', type: 'boolean', title: 'Usou a suplementação recomendada corretamente?' },
  { id: 'efeitoColateral', type: 'boolean', title: 'Percebeu algum efeito colateral?' },
  { id: 'pesoAtual', type: 'number', title: 'Balança: Qual é o seu peso atual (kg)?', placeholder: 'Ex: 75.5' },
  { id: 'objetivoPrincipal', type: 'options', title: 'Qual o objetivo principal no momento?', options: ['Perda de Gordura', 'Hipertrofia', 'Manutenção', 'Saúde e Condicionamento'] },
  { id: 'nivelComprometimento', type: 'scale', title: 'De 1 a 10, qual seu compromisso para os próximos 15 dias?' },
  { id: 'pontosMelhoria', type: 'textarea', title: 'O que você acha que pode melhorar?', placeholder: 'Fale sua dificuldade atual...' },
  { id: 'satisfeitoTreino', type: 'boolean', title: 'Está satisfeito com os treinos atuais?' },
  { id: 'ajustesPrograma', type: 'boolean', title: 'Gostaria de solicitar algum ajuste urgente no programa?' }
];

export default function CheckinAnamnese() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Initialize answers object
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const question = QUESTIONS[currentStep];
  const totalSteps = QUESTIONS.length;
  const progress = ((currentStep) / totalSteps) * 100;

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [question.id]: value });
    if (currentStep < totalSteps - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300); // Small delay for UX
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(prev => prev + 1);
  };
  
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const currentAnswer = answers[question.id];
  const canProceed = currentAnswer !== undefined && currentAnswer !== '';

  const submitForm = async () => {
    try {
      const newCheckin: Omit<Checkin, 'id'> = {
        clienteId: user?.id || '',
        data: new Date().toISOString().split('T')[0],
        status: 'pendente',
        
        adesaoTreino: Number(answers.adesaoTreino || 0),
        adesaoDieta: Number(answers.adesaoDieta || 0),
        adesaoSuplementacao: Number(answers.adesaoSuplementacao || 0),
        frequenciaTreino: String(answers.frequenciaTreino || ''),
        faltouTreino: answers.faltouTreino ? 'Sim' : 'Não',
        evolucaoCarga: answers.evolucaoCarga ? 'Sim' : 'Não',
        intensidadeTreino: answers.intensidadeTreino || '',
        dificuldadeExercicios: answers.dificuldadeExercicios ? 'Sim' : 'Não',
        dorDesconforto: answers.dorDesconforto ? 'Sim' : 'Não',
        nivelEnergia: answers.nivelEnergia || '',
        nivelMotivacao: answers.nivelMotivacao || '',
        evolucaoFisica: answers.evolucaoFisica ? 'Sim' : 'Não',
        seguiuDieta: answers.seguiuDieta ? 'Sim' : 'Não',
        furosDieta: answers.furosDieta ? 'Sim' : 'Não',
        nivelFome: answers.nivelFome || '',
        horasSono: String(answers.horasSono || ''),
        qualidadeSono: answers.qualidadeSono || '',
        nivelEstresse: answers.nivelEstresse || '',
        usouSuplementacao: answers.usouSuplementacao ? 'Sim' : 'Não',
        efeitoColateral: answers.efeitoColateral ? 'Sim' : 'Não',
        pesoAtual: String(answers.pesoAtual || ''),
        objetivoPrincipal: answers.objetivoPrincipal || '',
        nivelComprometimento: Number(answers.nivelComprometimento || 0),
        pontosMelhoria: answers.pontosMelhoria || '',
        satisfeitoTreino: answers.satisfeitoTreino ? 'Sim' : 'Não',
        ajustesPrograma: answers.ajustesPrograma ? 'Sim' : 'Não',
      };
      
      await addCheckin(newCheckin);
      alert('Check-in enviado com sucesso!');
      navigate('/aluno/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar check-in. Tente novamente.');
    }
  };

  return (
    <div className="anamnese-wizard">
      <div className="wizard-progress-bar">
        <div className="wizard-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="wizard-header">
        <button className="btn-icon" onClick={handlePrev} disabled={currentStep === 0}>
          <ChevronLeft size={24} />
        </button>
        <span className="wizard-step-count">PERGUNTA {currentStep + 1} DE {totalSteps}</span>
        <div style={{width: 24}}></div> {/* Placeholder para centralizar */}
      </div>

      <div className="wizard-content">
        <h2 className="wizard-question">{question.title}</h2>
        
        <div className="wizard-answer-area">
          {question.type === 'scale' && (
            <div className="wizard-scale">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button
                  key={num}
                  className={`wizard-scale-btn ${currentAnswer === num ? 'active' : ''}`}
                  onClick={() => handleAnswer(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {question.type === 'boolean' && (
            <div className="wizard-options-vertical">
              <button 
                className={`wizard-option-btn ${currentAnswer === true ? 'active' : ''}`} 
                onClick={() => handleAnswer(true)}
              >
                Sim
              </button>
              <button 
                className={`wizard-option-btn ${currentAnswer === false ? 'active' : ''}`} 
                onClick={() => handleAnswer(false)}
              >
                Não
              </button>
            </div>
          )}

          {question.type === 'options' && (
            <div className="wizard-options-vertical">
              {question.options?.map(opt => (
                <button
                  key={opt}
                  className={`wizard-option-btn ${currentAnswer === opt ? 'active' : ''}`}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {(question.type === 'text' || question.type === 'number') && (
            <div className="wizard-input-container">
              <input
                type={question.type}
                className="wizard-input"
                placeholder={question.placeholder}
                value={currentAnswer || ''}
                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
              />
            </div>
          )}

          {question.type === 'textarea' && (
            <div className="wizard-input-container">
              <textarea
                className="wizard-textarea"
                placeholder={question.placeholder}
                value={currentAnswer || ''}
                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                rows={5}
              />
            </div>
          )}
        </div>
      </div>

      <div className="wizard-footer">
        {currentStep === totalSteps - 1 ? (
          <button 
            className="btn btn-primary wizard-submit-btn" 
            onClick={submitForm}
            disabled={!canProceed}
          >
            <Check size={20} />
            ENVIAR CHECK-IN 💪
          </button>
        ) : (
          <button 
            className="btn btn-primary wizard-next-btn" 
            onClick={handleNext}
            disabled={!canProceed && question.type !== 'textarea'}
          >
            Próximo
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
