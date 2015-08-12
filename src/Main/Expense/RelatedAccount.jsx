'use strict';

var React = require('react');
var Immutable = require('immutable');
var TextField = require('material-ui/lib/text-field');

var polyglot = require('polyglot');
var utils = require('utils');
var pageAction = require('Main/pageAction');
var RelatedAccountDialog = require('Main/Expense/RelatedAccountDialog');
var MembersAvatar = require('Main/MembersAvatar');
var List = require('Main/List');
var accountStore = require('Main/Account/store');

var styles = {
  root: {
    width: '100%',
  },
};

var RelatedAccount = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    pageDialog: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    textFieldStyle: React.PropTypes.object,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  componentWillUpdate: function(nextProps) {
    var from = this.props.pageDialog;
    var to = nextProps.pageDialog;

    if (from !== to) {
      var dialog = this.refs.dialog;

      // Prevent the dispatch inside a dispatch
      setTimeout(function() {
        if (from === 'relatedAccount') {
          dialog.dismiss();
        }

        if (to === 'relatedAccount') {
          dialog.show();
        }
      });
    }
  },
  onFocus: function(event) {
    event.target.blur();
  },
  onTouchTap: function() {
    pageAction.showDialog('relatedAccount');
  },
  onDismiss: function() {
    pageAction.dismissDialog();
  },
  render: function() {
    var props = this.props;
    var relatedAccount;
    var accounts = accountStore.getAll();

    if (props.account.get('_id')) {
      var avatar = <MembersAvatar members={props.account.get('members')} />;
      relatedAccount = <div>
          {polyglot.t('expense_related_account')}
          <List left={avatar} onTouchTap={this.onTouchTap} withoutMargin={true}>
            {utils.getNameAccount(props.account)}
          </List>
        </div>;
    } else {
      relatedAccount = <TextField hintText={polyglot.t('expense_related_account')} onTouchTap={this.onTouchTap}
        onFocus={this.onFocus} fullWidth={true} className="testExpenseAddRelatedAccount"
        style={props.textFieldStyle} />;
    }

    return <div style={styles.root}>
        {relatedAccount}
        <RelatedAccountDialog ref="dialog" accounts={accounts} selected={props.account.get('_id')}
          onChange={props.onChange} onDismiss={this.onDismiss} />
      </div>;
  },
});

module.exports = RelatedAccount;
