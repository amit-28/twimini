<h1>Tweets</h1>

<pre><?php print_r($tweets); ?> </pre>
<table>
    <tr>
        <th>User Id</th>
        <th>Tweet Id</th>
        <th>Retweet Status</th>
        <th>Created</th>
        <th>Originator</th>
        <th>Immediator</th>
    </tr>

    <?php foreach ($tweets as $tweet): ?>
    <tr>
        <td><?php echo $tweet['TweetDetail']['user_detail_id']; ?></td>
        <td>
            <?php echo $this->Html->link($tweet['TweetDetail']['tweet_id'],array('controller'=>'Tweets','action'=>'view',$tweet['TweetDetail']['tweet_id']));?>
        </td>
        <td><?php echo $tweet['TweetDetail']['RStatus'];?></td>
        <td><?php echo $tweet['TweetDetail']['TweetTime']; ?></td>
        <td><?php echo $tweet['TweetDetail']['OrgID']; ?></td>
        <td><?php echo $tweet['TweetDetail']['InterID']; ?></td>
    </tr>
    <?php endforeach; ?>
    <?php unset($tweet)?>
</table>