const { default: axios } = require("axios");

const run = async () => {
  const urls = [
    {
      url: "https://www.youtube.com/watch?v=2ZLl8GAk1X4&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=tM6OOJt0S2Y&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=_7UQPve99r4&t=11s&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=o5t7PxRJSXk&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=vb7CgDcA_6U&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=vDJq3QavcaQ&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=nKovSmd5DWY&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=YdWkUdMxMvM&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=5rNk7m_zlAg&t=12s&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=5ZdHfJVAY-s&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=OwjKN9_NqPI&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=e2nkq3h1P68&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=Jdc0i7RcBv8&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=BAregq0sdyY&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=KkC_wYM_Co4&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=DNPF0oPcMDs&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=x0AnCE9SE4A&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=lzelnAI914A&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=Zr6fnhvJKlw&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=qHPonmSX4Ms&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=x0AnCE9SE4A&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=H9KefzbryEw&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=6nz8GXjxiHg&t=2s&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=DjutoyfCl2c&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=PHsC_t0j1dU&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=9t9Mp0BGnyI&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=h_mk2Uci9o0&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=PSNXoAs2FtQ&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=dJhlMn2otxA&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=VhM2ByShhzE&t=28s&ab_channel=freeCodeCamp.org",
    },
    {
      url: "https://www.youtube.com/watch?v=Bvwq_S0n2pk&ab_channel=freeCodeCamp.org",
    },
  ];

  const result = await Promise.all(
    urls.map(
      (body) =>
        new Promise(async (res, rej) => {
          const reqUrl = `http://127.0.0.1:8787/api/courses`;

          const resp = await fetch(reqUrl, {
            method: "POST",
            body: JSON.stringify(body),
          });
          const json = await resp.json();
          return res({ ...json, ...body });
        })
    )
  );

  console.log(result);
};

run();
