<?php
class EJFExporter {

	private static $dictionary = null;
	private static $language = null;

	/** Parser for EasyJsonForm contents. $form must be a full json_decoded() structure export  */
	static function formOutput($form, $language = 'en', $html = false) {
		self::loadDictionary($language);
		$result = [];
		foreach ($form as $item) foreach (self::formItemOutput($item, $language) as $k => $v) $result[$k] = $v;
		if (!$html)
			return $result;
		else {
			$htmlResult = '<table>';
			foreach ($result as $key => $value)
				$htmlResult.= "<tr><td><strong>$key</strong></td><td>$value</td></tr>";
			$htmlResult.= '</table>';
			return $htmlResult;
		}
	}

	static function formItemOutput($item, $language = 'en')
	{
		self::loadDictionary($language);
		$result = [];

		switch ($item->type) {
			case 'textgroup':
				foreach ($item->value as $i => $textItem)
					$result["{$item->label} - {$item->properties->items[$i]}"] = $textItem;
				break;
			case 'multiplechoice':
				foreach ($item->value as $i => $textItem)
					$result["{$item->label} - {$item->properties->items[$i]}"] = 
						$textItem ? self::$dictionary['common.value.yes'] : self::$dictionary['common.value.no'];
				break;
			case 'singlechoice':
				$result[$item->label] = ($item->value === null || $item->value == 'null') ? '' :
					$item->properties->items[$item->value];
				break;
			case 'file':
				$result[$item->label] = ($item->value === null || $item->value == '') ? '' :
					self::$dictionary['item.file.vaule.uploaded.file'];
				break;
			default:
				$result[$item->label] = ($item->value === null || $item->value == '') ? '' :
					$item->value;
				break;
		}
		return $result;
	}

    private static function loadDictionary($language = null) {
		// Dictionary has been already loaded. Nothing to do.
		if (self::$language === $language && self::$dictionary !== null) return;

		self::$language = $language;
		$contents = null;
		$matches = null;

		// Default dictionary: English
		if (empty($language) or $language == 'en') {
			
			if (file_exists(__DIR__.'/../easyjsonform-module.js'))
				$contents = file_get_contents(__DIR__.'/../easyjsonform-module.js');
			else if (file_exists(__DIR__.'/../easyjsonform.js'))
				$contents = file_get_contents(__DIR__.'/../easyjsonform.js');
			else {
				self::$dictionary =[];
				return;
			}

			preg_match('/dictionary\s+=\s+({.*});/s', $contents, $matches, PREG_OFFSET_CAPTURE, 0);
			self::$dictionary = empty($matches[1][0]) ? [] : json_decode($matches[1][0], true);
		}
		// Dictionary for other languagees
		else {
			if (file_exists(__DIR__.'/../lang-'.$language.'-module.js'))
				$contents = file_get_contents(__DIR__.'/../lang-'.$language.'-module.js');
			else if (file_exists(__DIR__.'/../lang-'.$language.'.js'))
				$contents = file_get_contents(__DIR__.'/../lang-'.$language.'.js');
			else {
				self::$dictionary =[];
				return;
			}

			preg_match('/\w+\s+=\s+({.*});/s', $contents, $matches, PREG_OFFSET_CAPTURE, 0);
			self::$dictionary = empty($matches[1][0]) ? [] : json_decode($matches[1][0], true);
		}
    }
}
