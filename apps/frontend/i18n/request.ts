import { getRequestConfig } from 'next-intl/server';
import fs from 'fs/promises';
import path from 'path';
import { getUserLocale } from './utils';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  const translationsPath = path.join(process.cwd(), 'i18n', 'translations');

  const namespaces = await fs.readdir(translationsPath);

  const imports = await Promise.all(
    namespaces.map(async (ns) => {
      try {
        return (await import(`./translations/${ns}/${locale}.json`)).default;
      } catch (err) {
        return {};
      }
    })
  );

  const messages = Object.assign({}, ...imports);

  return {
    locale,
    messages,
  };
});