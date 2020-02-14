import {RXComponent} from "../../basic/rxcomponent"
import {OpLabel} from "./label"
import {OpIconButton} from "./buttons"

class SelectItem extends RXComponent{
  constructor(id, value){
    super('li')
    this.id = id
    this.value = value
    this.setInnerHTML(value)
    this.selected = (id, value)=>{}
    this.domOn('click', ()=>{
      this.selected(this.id, this.value)
    })      
  }
}

class SlectedList  extends RXComponent{
  constructor(list = {}){
    super('ul')
    this.cssClass('select-list')
    this.list = list
    this.valueChage = (id, text)=>{}

    for(var id in list){
      var li = new SelectItem(id, list[id])
      li.selected =  (id, value)=>{
        this.valueChage(id, value)
      }
      this.pushChild(li)
    }
  }


}

export class OpSelect extends RXComponent{
  constructor(list, fieldName ,selected = '', required = false){
    super()
    this.cssClass('ctl-select')
    this.fieldName = fieldName
    this.selected = selected
    this.valueViewer = new OpLabel()
    this.valueChanged = (value, fieldName)=>{}
    var emptyValue = '-Select-'
    if(!required){
      this.clearBtn = new OpIconButton('×')
      this.pushChild(this.clearBtn)
      this.clearBtn.domOn('click', ()=>{
        this.valueViewer.setText(emptyValue)
        if(this.selected){
          this.valueChanged('', this.fieldName)
        }
        this.selected = ''
      })
    }
    this.pushChild(this.valueViewer)

    this.listViewer = new SlectedList(list, required)
    this.valueViewer.setText(selected?list[selected]:emptyValue)
    this.valueViewer.setRightIcon('▾')
    this.pushChild(this.listViewer)

    this.valueViewer.domOn('click',(event)=>{
      this.listViewer.show()
      event.stopPropagation()
    })

    document.addEventListener('mousedown', ()=>{
      this.listViewer.hide()
    })

    this.listViewer.domOn('mousedown',(event)=>{
      event.stopPropagation()
    })

    this.listViewer.valueChage = (id, value)=>{
      //console.log(id, text)
      if(id !== this.selected){
        this.valueChanged(id, this.fieldName)
      }
      this.selected = id
      this.valueViewer.setText(value)
      this.listViewer.hide()
    }

  }


}