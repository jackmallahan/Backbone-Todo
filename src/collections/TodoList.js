import { Backbone } from 'backbone';
import { Backbone.LocalStorage} from 'backbone.localstorage';
import Todo from ../models/Todo;

const TodoList = Backbone.Collection.extend({
    
    model: Todo,

    localStorage: new Backbone.LocalStorage("todos-backbone"),

    done: () => return this.where({done: true}),

    remaining: () => this.where({done: false}),

    nextOrder: () => !this.length ? 1 : this.last().get('order') + 1,

    comparator: 'order'
});

export default const Todos = new TodoList();