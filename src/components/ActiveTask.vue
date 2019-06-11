<template>
    <div class="section">
        <h2>Active Task</h2>
        
        <div v-if="task" class="border">
            
            <br/>
            <!--  Main Section (Flex Grow)  -->
            <div class="d-flex align-items-center justify-content-center">
                
                <!--  Checkbox Container  -->
                <div class="checkbox-container">
                    <input class="task-checkbox" type="checkbox" v-model="task.completed" @change="$root.completeTask(task.id)"/>
                    <span class="check-custom"></span>
                </div>

                <!--  Task Name & Field (when editing)  -->
                <div class="task-name-container">
                    <span class="task-name" v-if="!editing" v-on:click="editing = true">{{task.name}}</span>
                    <div v-if="editing" class="d-flex align-items-center">
                        <input class="edit-task" v-model="task.name" @keyup.enter="editing = false"/>
                        <button type="button" class="btn btn-primary" v-on:click="editing = false">
                            <font-awesome-icon icon="save"/>
                        </button>
                    </div>
                </div>
            </div>
            
            <!--  Play Task Button  -->
            <button type="button" class="btn btn-success btn-lg">
                <font-awesome-icon icon="play"/>
            </button>
            
            <br/><br/>
            <h6>
                {{dateType}} on
            </h6>
            <div>
                {{displayDate}}
            </div>
            <div>
                {{displayTime}}
            </div>
            <div class="flex-column">
                <button type="button" class="btn btn-warning" v-on:click="editing = true">
                    <font-awesome-icon icon="pencil-alt"/>
                </button>
                <button type="button" class="btn btn-danger" v-on:click="$root.deleteTask(task.id)">
                    <font-awesome-icon icon="trash-alt"/>
                </button>
            </div>
            <br/>
        </div>

        
    </div>
</template>

<script>
  import moment from 'moment'
  
  export default {
    name: "ActiveTask",
    props: {
      task: Object
    },
    data: () => ({
      editing: false
    }),
    computed: {
      dateType: function() {
        return this.task.completed ? 'Completed' : 'Created'
      },
      date: function() {
        return this.task.completed ? this.task.completedDate : this.task.createdDate
      },
      displayDate: function() {
        return moment(this.date).format('ddd MMM DD YYYY,')
      },
      displayTime: function() {
        return moment(this.date).format('h:mm a')
      }
    }
  }
</script>

<style scoped>
    
    .task-name-container {
        margin-left: 5px;
    }
    
    .task-name {
        font-weight: bolder;
        font-size: x-large;
    }
    
    /* Adapted from https://hackernoon.com/hacking-custom-checkboxes-and-radios-5d48230440d */

    .checkbox-container {
        margin-right: 20px;
        position: relative;
        width: 2rem;
        height: 2rem;
    }

    .checkbox-container > * {
        position: absolute;
        width: 2rem;
        height: 2rem;
    }

    /* Styles for hiding the native checkbox */
    .task-checkbox {
        z-index: 2;
        opacity: 0;
        cursor: pointer;
    }

    /* Styles for the basic appearance of the custom checkbox */
    .check-custom {
        border: 2px solid #969696;
        border-radius: 50%;
    }

    /* Styles for the hover state of the custom checkbox */
    .task-checkbox:hover ~ .check-custom {
        border-color: #4a4a4a;
    }

    /* Styles for the focus state of the custom checkbox */
    .task-checkbox:focus ~ .check-custom {
        border-color: #b0d5ff;
        box-shadow: 0 0 0 2px rgba(23, 133, 255, 0.25);
    }

    /* Styles for the checked state of the custom checkbox */
    .task-checkbox:checked ~ .check-custom {
        border-color: #1785ff;
        background: #1785ff url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
        background-size: 75%;
    }
    
    .btn {
        margin: 8px;
    }
</style>