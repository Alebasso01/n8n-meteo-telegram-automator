export default {
  async scheduled(event, env, ctx) {
    const tz = "Europe/Rome";
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Esegui solo alle 08:00 italiane
    if (!(hour === 8 && minute < 5)) return;

    const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=44.4056&longitude=8.9463&timezone=Europe%2FRome&current=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max");
    const d = await r.json();

    const msg = [
      "☀️ *Meteo di oggi – Genova*",
      `Temperatura attuale: ${d.current.temperature_2m}°C`,
      `Max/Min: ${d.daily.temperature_2m_max[0]}°C / ${d.daily.temperature_2m_min[0]}°C`,
      `Pioggia: ${d.daily.precipitation_probability_max[0]}%`,
    ].join("\n");

    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      body: new URLSearchParams({
        chat_id: env.CHAT_ID,
        text: msg,
        parse_mode: "Markdown"
      }),
    });
  }
};
