
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'components/common/style.scss';
import {checkStatus} from 'components/common/utils';
import {MDparse,SndList,IList} from 'components/common/md';
interface IRest {
    ts:number
    md:string
    file:string
    
}
interface IDocument {
    key:string
    text:string
    ts:number
    render:string
    list:IList[]
}
interface IApp{
    init:boolean,
    items:IDocument[]
    list:IList[]
    nav:string
    snd:string
    main:string
}
    

class App extends React.Component<any,IApp> {
    state:IApp={
        init:true,
        items:[],
        list:[],
        nav:'',
        snd:'',
        main:''
    }
    private _navClick=(item:IDocument)=>{
        // event.preventDefault()
        this.setState({list:item.list,nav:item.key,main:item.render,init:false});
    }
    private _listClick=(item:IList)=>{
        this.setState({snd:item.url});
        console.log(item.title);
        location.href = '#' + (new Buffer(item.title,'utf-8')).toString('base64');
    }
  public render() {
      const {items,list,nav,main,snd,init} = this.state;
    return (
      <div id='layout'>
          <div id='nav'>
            <ul>
                {
                    items.map((item:IDocument)=>{
                        let active=item.key===nav?'active':'';
                        return <li key={item.key} className={active}><a onClick={(e)=>this._navClick(item)}   href="#">{item.text}</a></li>
                    })
                }
            
                
            
            </ul>
            <ul>
                <li className="sign"><span className="html"></span>HTML</li><li className="sign"><span className="post"></span>POST</li><li className="sign"><span className="get"></span>GET</li></ul>
          </div>
          {
              init?'':
          <div id='list'> 
          {
              list.map((item:IList)=>{
                let active=item.url==snd?'active':'';
                return <dl onClick={()=>{this._listClick(item)}} key={item.url} className={item.method+' '+active}><dt>{item.title}</dt><dd><span className="author">{item.author}</span><span className="date">{item.date}</span></dd></dl>
              })
          }
   
           </div>
          }
          {
               init?'':
          <div id='main'>
            <div dangerouslySetInnerHTML={{__html: main}}></div>
          </div>
          }
          {
              init?<div id='mask'  >
              <img src='./gomamon.jpg'/>
          </div>
          :
          ''
          }
          
          
      </div>
    );
  }
  public componentDidMount=()=>{
    const fn = (d:IRest[])=>{
        const items:IDocument[]=[];
        d.map(item=>{
            const cnt = (new Buffer(item.md, 'base64')).toString();
           
            items.push({
                key:item.file,
                text:(new Buffer(item.file, 'base64')).toString(),
                ts:0,
                render:MDparse(cnt),
                
                list:SndList(MDparse(cnt))
            });
        })
        // for(let i=0;i<d.length;i++) {
        //     //console.log(d[i]);
        //     //let raw=d[i].file
        //     let bf = new Buffer(d[i].file, 'base64')
        //     const text = bf.toString();
        //     bf = new Buffer(d[i].md, 'base64')
        //     const cnt = bf.toString();
            
        //     ;

        //     items.push({
        //         key:d[i].file,
        //         text,
        //         ts:d[i].ts,
        //         render:MDparse(cnt),
                
        //         list:SndList(MDparse(cnt))
        //     });
        // }
        this.setState({items});
    }
    fetch('/doc.json',{
        
        method: 'GET',
        

      }).then(checkStatus).then((response:Response)=>{return response.json()}).then(fn);
  }
  
}

ReactDOM.render(<App />, document.getElementById('root'));