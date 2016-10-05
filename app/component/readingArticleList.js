/**
 * Created by lipeiwei on 16/10/5.
 */

import React, {PropTypes, Component} from 'react';
import {
  ListView,
  StyleSheet
} from 'react-native';
import ReadingArticleItem from './readingArticleItem'
import {getSpecifiedTypeArticleList} from '../api/reading';
import BaseComponent from '../base/baseComponent';
import monthArray from '../constant/month';

const styles = StyleSheet.create({
  listView: {
    flex: 1
  }
});

class ReadingArticleList extends BaseComponent {

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.fetchData = this.fetchData.bind(this);
    let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    if (this.props.articleList) {
      dataSource = dataSource.cloneWithRows(this.props.articleList)
    }
    this.state = {dataSource};
  }

  getNavigationBarProps() {
    return {
      hideRightButton: true,
      title: `${monthArray[this.props.month]}.${this.props.year}`,
      leftButtonImage: require('../image/return.png')
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    //本来是用if(year && month && index)来判断, 但比如当index==0的时会有问题
    if ('year' in this.props && 'month' in this.props && 'index' in this.props) {
      const {year, month, index} = this.props;
      getSpecifiedTypeArticleList(year, month, index).then(articleList => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(articleList)
        });
      });
    }
  }

  //更新props
  componentWillReceiveProps(newProps) {
    if (newProps.articleList && newProps.articleList !== this.props.articleList) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newProps.articleList)
      });
    }
  }

  renderBody() {
    return (
      <ListView
        style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}/>
    );
  }

  renderRow(data) {
    return (
      <ReadingArticleItem onPress={() => this.onPress(data)} data={data}/>
    );
  }

  onPress(data) {

  }

}

ReadingArticleList.propTypes = {
  articleList: PropTypes.array,

  year: PropTypes.number,
  month: PropTypes.number,
  index: PropTypes.number
};

export default ReadingArticleList;