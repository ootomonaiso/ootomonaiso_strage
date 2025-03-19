export async function POST(req: Request) {
    const formData = new FormData();
    const { image } = await req.json();
    formData.append("file", image);
    formData.append("requireSignedURLs", "false");
  
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_KEY}`,
        },
        body: formData,
      }
    );
  
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status });
  }
  