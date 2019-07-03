import { storiesOf, configure } from '@storybook/vue';

const req = require.context('../stories', true, /\.story\.vue$/);

const parseFilename = (filename) => {
    const parts = filename.split('/');
    const name = parts[parts.length - 1].replace(/\.story\.vue$/, '');
    const group = parts.slice(1, -1).join('/') || 'Root';
    return { name, group };
};

const registerStory = (filename) => {
    const component = req(filename).default;
    const { group, name } = parseFilename(filename);

    storiesOf(group, module)
        .add(name, () => ({
            name: 'StoryWrapper',
            components: component.components,
            render(h) {
                return h(component);
            }
        }));
};

function loadStories() {
    req.keys().forEach((filename) => {
        registerStory(filename);
    });
}

configure(loadStories, module);
