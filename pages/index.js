import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [formData, setFormData] = useState({
    model: '',
    temperature: 0,
    systemMsg: '',
    userMsg: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Chat Endpoint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>OpenAI Chat Endpoint</h1>
        {/* error */}
        {error && <div className={styles.error} aria-live="polite" role="alert">{error}</div>}

        {/* form */}
        <form onSubmit={onSubmit}>
          <select
            className={styles.select}
            name="model"
            aria-label="Select InstructGPT Model"
            onChange={(e) => updateFormData('model', e.target.value)}
          >
            <option value="">Select One</option>
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            <option value="text-davinci-003">text-davinci-003</option>
          </select>
          <input
            className={styles.input}
            type="number"
            name="temperature"
            placeholder="Temperature (0-2, steps of 0.1)"
            step="0.1"
            onChange={(e) => updateFormData('temperature', e.target.value)}
          />
          <textarea
            className={styles.textarea}
            type="text"
            name="systemMsg"
            placeholder="System input..."
            value={formData.text}
            onChange={(e) => updateFormData('systemMsg', e.target.value)}
          ></textarea>
          <textarea
            className={styles.textarea}
            type="text"
            name="userMsg"
            placeholder="User input..."
            value={formData.text}
            onChange={(e) => updateFormData('userMsg', e.target.value)}
          ></textarea>
          <button type="submit" className={styles['btn-submit']} disabled={loading}>
            {loading ? 'Processing...' : 'Submit' }
          </button>
        </form>

        {/* result */}
        {result ? (
          <div class={styles.response}>
            <h2>Response</h2>
            <div className={styles.result}>{result?.choice?.message?.content || 'Missing message content'}</div>
            <pre className={styles.code}>{JSON.stringify(result?.raw || {}, null, 2)}</pre>
          </div>
        ) : null}

      </main>
    </div>
  );
}
