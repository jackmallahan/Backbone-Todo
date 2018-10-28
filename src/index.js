import { Backbone } from 'backbone';
import { _ } from 'lodash';
import { $ } from 'jquery';
import TodoView from './views/TodoView';

const AppView = Backbone.View.extend({
    el: $("#todoapp"),

    statsTemplate: _.template($('#stats-template').html()),

    events: {
      "keypress #new-todo":  "createOnEnter",
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete"
    },

    initialize: () => {

      this.input = this.$("#new-todo");
      this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Todos, 'add', this.addOne);
      this.listenTo(Todos, 'reset', this.addAll);
      this.listenTo(Todos, 'all', this.render);

      this.footer = this.$('footer');
      this.main = $('#main');

      Todos.fetch();
    },

    render: () => {
      const done = Todos.done().length;
      const remaining = Todos.remaining().length;

      if (Todos.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    addOne: (todo) => {
      const view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    addAll: () => {
      Todos.each(this.addOne, this);
    },

    createOnEnter: (e) => {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Todos.create({title: this.input.val()});
      this.input.val('');
    },

    clearCompleted: () => {
      _.invoke(Todos.done(), 'destroy');
      return false;
    },

    toggleAllComplete: () => {
      const done = this.allCheckbox.checked;
      Todos.each(function (todo) { todo.save({'done': done}); });
    }
})