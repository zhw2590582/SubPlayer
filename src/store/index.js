import { useLocalStore } from 'mobx-react-lite';

export default useLocalStore({
    title: 'Test',
    done: true,
    toggle() {
        this.done = !this.done;
    },
});
