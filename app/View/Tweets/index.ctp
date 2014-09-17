    <h1> Enter User id </h1>
    <?php
    echo $this->Form->create('FetchTweets');
    echo $this->Form->input('id');
    echo $this->Form->end('Show tweets');
    ?>
