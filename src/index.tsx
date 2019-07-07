import { IList, MDparse, SndList } from 'components/common/md';
import 'components/common/style.scss';
import { checkStatus } from 'components/common/utils';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
interface IRest {
  ts: number;
  md: string;
  file: string;
}
interface IDocument {
  key: string;
  text: string;
  ts: number;
  render: string;
  list: IList[];
}
interface IApp {
  init: boolean;
  items: IDocument[];
  list: IList[];
  nav: string;
  snd: string;
  main: string;
  y: number;
  w: number;
  h: number;
}

class App extends React.Component<{}, IApp> {
  public state: IApp = {
    init: true,
    items: [],
    list: [],
    nav: '',
    snd: '',
    main: '',
    y: 0,
    h: 800,
    w: 1000
  };

  public componentWillUnmount = () => {
    const _this = this;
    window.removeEventListener('scroll', e => {
      _this.handleScroll(e);
    });
  };
  public handleScroll = (e: React.MouseEvent<Element, MouseEvent>) => {
    // console.log(e.pageX, e.pageY);
    const main = document.querySelector('#main');
    let { h } = this.state;
    if (main) {
      const mainH = main.scrollHeight;
      h = mainH;
    }
    const y = e.pageY;
    if (y !== undefined) {
      this.setState({ y, h });
    }
  };
  public render(): JSX.Element {
    const { items, list, nav, main, snd, init, y, w, h } = this.state;
    const heightStypes: React.CSSProperties = {
      height: `${h}px`
    };
    const navStypes: React.CSSProperties = {
      width: `${w * 0.125}px`,
      top: `${y}px`
    };
    const listStypes: React.CSSProperties = {
      width: `${w * 0.25}px`,
      top: `${y}px`
    };
    return (
      <div id="layout">
        <div id="nav" style={heightStypes}>
          <div style={navStypes}>
            <ul>
              {items.map((item: IDocument) => {
                const active = item.key === nav ? 'active' : '';
                return (
                  <li key={item.key} className={active}>
                    <a onClick={(e: React.MouseEvent) => this._navClick(item)} href="#">
                      {item.text}
                    </a>
                  </li>
                );
              })}
            </ul>
            <ul>
              <li className="sign">
                <span className="html" />
                HTML
              </li>
              <li className="sign">
                <span className="post" />
                POST
              </li>
              <li className="sign">
                <span className="get" />
                GET
              </li>
            </ul>
          </div>
        </div>
        {init ? (
          ''
        ) : (
          <div id="list">
            <div style={listStypes}>
              {list.map((item: IList) => {
                const active = item.url === snd ? 'active' : '';
                return (
                  <dl
                    onClick={() => {
                      this._listClick(item);
                    }}
                    key={item.url}
                    className={item.method + ' ' + active}
                  >
                    <dt>{item.title}</dt>
                    <dd>
                      <span className="author">{item.author}</span>
                      <span className="date">{item.date}</span>
                    </dd>
                  </dl>
                );
              })}
            </div>
          </div>
        )}
        {init ? (
          ''
        ) : (
          <div id="main">
            <div dangerouslySetInnerHTML={{ __html: main }} />
          </div>
        )}
        {init ? (
          <div id="mask">
            <img src="./gomamon.jpg" />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
  public componentDidMount = () => {
    const fn = (d: IRest[]) => {
      const items: IDocument[] = [];
      d.map((item: IRest) => {
        const cnt = Buffer.from(item.md, 'base64').toString();

        items.push({
          key: item.file,
          text: Buffer.from(item.file, 'base64').toString(),
          ts: 0,
          render: MDparse(cnt),
          list: SndList(MDparse(cnt))
        });
      });
      this.setState({ items });
    };
    fetch('/doc.json?' + new Date().getSeconds().toString(), {
      method: 'GET'
    })
      .then(checkStatus)
      .then((response: Response) => {
        return response.json();
      })
      .then(fn);
    const _this = this;
    window.addEventListener('scroll', e => {
      _this.handleScroll(e);
    });
    const body = document.querySelector('body');

    let w = 2014;
    let h = 800;
    if (body) {
      w = body.offsetWidth;
      h = body.clientHeight;
    }
    this.setState({ w, h });
  };

  private _navClick = (item: IDocument) => {
    // event.preventDefault()
    this.setState({
      list: item.list,
      nav: item.key,
      main: item.render,
      init: false
    });
  };
  private _listClick = (item: IList) => {
    this.setState({ snd: item.url });
    console.log(item.title);
    location.href = '#' + Buffer.from(item.title, 'utf-8').toString('base64');
  };
}
ReactDOM.render(<App />, document.getElementById('root'));
