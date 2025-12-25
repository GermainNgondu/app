export function __(key, replace = {}) {
    let translation = window.translations[key] || key;

    Object.keys(replace).forEach(r => {
        translation = translation.replace(`:${r}`, replace[r]);
    });

    return translation;
}