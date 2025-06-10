// src/pages/PasswordResetPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const PasswordResetPage: React.FC = () => {
  // Шаг формы: 1 — отправка письма, 2 — ввод кода и нового пароля
  const [step, setStep] = useState<1 | 2>(1);

  // Общие состояния
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Состояния для второго шага (ввод кода и нового пароля)
  const [code, setCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Обработчик отправки email, чтобы пользователь получил код
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError('Пожалуйста, введите email.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://localhost:7091/api/user/request-reset', { email });
      setSuccessMessage('Код подтверждения выслан на указанный email.');
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          'Не удалось отправить код. Проверьте email и попробуйте ещё раз.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Обработчик подтверждения кода и установки нового пароля
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!code) {
      setError('Пожалуйста, введите код подтверждения.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError('Пожалуйста, заполните поля с новым паролем.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Пароль должен быть не менее 6 символов.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('https://localhost:7091/api/user/confirm-reset', {
        email,
        code,
        newPassword,
      });
      setSuccessMessage('Пароль успешно изменён. Теперь вы можете войти.');
      navigate("/login")

      // После успешного сброса можно, например, перенаправить пользователя на страницу логина
      // или оставить сообщение и кнопку "Перейти на страницу входа".
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          'Не удалось сбросить пароль. Проверьте ввод и попробуйте ещё раз.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Восстановление пароля
          </h1>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 text-green-600 text-sm text-center">
              {successMessage}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Отправка...' : 'Отправить код'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="email-step2"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email-step2"
                  value={email}
                  readOnly
                  className="w-full bg-gray-100 border border-gray-300 rounded p-2 cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Код подтверждения
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Новый пароль
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Повтор пароля
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Обработка...' : 'Сменить пароль'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PasswordResetPage;
