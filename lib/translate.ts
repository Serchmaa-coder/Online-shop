// /pages/api/translate.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { TranslationServiceClient } from '@google-cloud/translate';

const client = new TranslationServiceClient();

const projectId = 'onlineshop-d6769';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res
        .status(400)
        .json({ error: 'Text and target language are required' });
    }

    try {
      const [response] = await client.translateText({
        parent: client.locationPath(projectId, 'global'),
        contents: [text],
        mimeType: 'text/plain',
        targetLanguageCode: targetLanguage,
      });

      if (response.translations && response.translations[0]) {
        const translatedText = response.translations[0].translatedText;
        return res.status(200).json({ translatedText });
      } else {
        return res
          .status(500)
          .json({ error: 'Translation not found in the response' });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Error during translation', details: error });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
