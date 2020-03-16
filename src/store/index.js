import { observable } from 'mobx-react';

export default observable({
    title: 'Test',
    done: true,
    toggle() {
        this.done = !this.done;
    },
});
